import Anthropic from '@anthropic-ai/sdk';
import type { AIProviderConfig, Publisher, Report } from '$lib/types';
import type { ParseResult, ReportMetadata } from '$lib/services/AIService';
import type { AIProvider, ConnectionTestResult } from './AIProviderInterface';
import { PromptService } from '../prompts/PromptService';

interface AIResponse {
	reports: Array<{
		name: string;
		isActive: boolean;
		hours?: number;
		studies?: number;
		comment?: string;
		originalText?: string;
		isNew: boolean;
		matchConfidence: 'high' | 'medium' | 'low';
		reportedBy: string;
		reasoning: string;
	}>;
	reasoning: string;
}

export class AnthropicProvider implements AIProvider {
	readonly name = 'Anthropic';
	private client?: Anthropic;
	private config?: AIProviderConfig;

	validateConfig(config: AIProviderConfig): boolean {
		if (config.provider !== 'anthropic') return false;
		if (!config.apiKey) return false;
		if (!config.model) return false;
		return true;
	}

	async testConnection(config: AIProviderConfig): Promise<ConnectionTestResult> {
		if (!this.validateConfig(config)) {
			return { success: false, error: 'Invalid configuration' };
		}

		try {
			const client = this.createClient(config);
			// Test with a simple completion
			await client.messages.create({
				model: config.model,
				max_tokens: 5,
				messages: [{ role: 'user', content: 'Hello, this is a test.' }]
			});
			return { success: true };
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error) {
				const status = (error as { status: number }).status;
				const message = (error as { message?: string }).message || 'Unknown error';

				switch (status) {
					case 401:
						return { success: false, error: 'Invalid API key. Please check your API key.' };
					case 403:
						return { success: false, error: 'Access forbidden. Check your API key permissions.' };
					case 429:
						return { success: false, error: 'Rate limit exceeded. Please try again later.' };
					case 404:
						return { success: false, error: 'Model not found. Please check your model selection.' };
					default:
						return { success: false, error: `Connection failed (${status}): ${message}` };
				}
			}

			if (error instanceof Error) {
				return { success: false, error: error.message };
			}

			return { success: false, error: 'Unknown connection error' };
		}
	}

	createClient(config: AIProviderConfig): Anthropic {
		if (!this.validateConfig(config)) {
			throw new Error('Invalid Anthropic configuration');
		}

		return new Anthropic({
			apiKey: config.apiKey,
			baseURL: config.endpoint || 'https://api.anthropic.com'
		});
	}

	async parseMessages(
		messages: string,
		publishers: Publisher[],
		language: string = 'en'
	): Promise<ParseResult> {
		if (!this.config) {
			throw new Error('Provider not configured');
		}

		if (!this.client) {
			this.client = this.createClient(this.config);
		}

		const { systemPrompt, userPrompt } = PromptService.getPrompts(messages, publishers, language);

		try {
			const response = await this.client.messages.create({
				model: this.config.model,
				max_tokens: 4000,
				temperature: 0.1,
				system: systemPrompt,
				messages: [
					{
						role: 'user',
						content: userPrompt
					}
				]
			});

			const content = response.content[0];

			if (!content || content.type !== 'text') {
				throw new Error('No response from Anthropic');
			}

			const aiResponse: AIResponse = JSON.parse(content.text);
			return this.convertAIResponseToParseResult(aiResponse, publishers);
		} catch (error) {
			// Handle specific Anthropic errors
			if (error && typeof error === 'object' && 'status' in error) {
				const status = (error as { status: number }).status;
				const message = (error as { message?: string }).message || 'Unknown AI service error';

				switch (status) {
					case 429:
						throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
					case 401:
						throw new Error('Invalid API key. Please check your AI API key in settings.');
					case 403:
						throw new Error(
							'Access forbidden. Your API key may not have the required permissions.'
						);
					case 404:
						throw new Error('AI model not found. The requested model may not be available.');
					case 500:
						throw new Error(
							'Anthropic service is temporarily unavailable. Please try again later.'
						);
					case 502:
					case 503:
					case 504:
						throw new Error(
							'Anthropic service is experiencing issues. Please try again in a few minutes.'
						);
					default:
						throw new Error(`Anthropic service error (${status}): ${message}`);
				}
			}

			// Handle JSON parsing errors
			if (error instanceof SyntaxError) {
				throw new Error('Invalid response format from Anthropic. Please try again.');
			}

			// Handle network errors
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error('Network error. Please check your internet connection and try again.');
			}

			// Handle generic errors
			if (error instanceof Error) {
				throw new Error(`Failed to parse messages: ${error.message}`);
			}

			throw new Error('Unknown error occurred while parsing messages');
		}
	}

	// Configure the provider with settings
	configure(config: AIProviderConfig): void {
		if (!this.validateConfig(config)) {
			throw new Error('Invalid Anthropic configuration');
		}
		this.config = config;
		this.client = this.createClient(config);
	}

	private convertAIResponseToParseResult(
		aiResponse: AIResponse,
		existingPublishers: Publisher[]
	): ParseResult {
		const newPublishers: Publisher[] = [];
		const reports: Report[] = [];
		const metadata = new Map<string, ReportMetadata>();
		const publisherMap = new Map<string, string>(); // name -> id mapping

		// Create map of existing publishers
		existingPublishers.forEach((pub) => {
			publisherMap.set(pub.name.toLowerCase(), pub.id);
		});

		aiResponse.reports.forEach((aiReport) => {
			let publisherId: string;
			const normalizedName = aiReport.name.toLowerCase();

			if (aiReport.isNew || !publisherMap.has(normalizedName)) {
				// Create new publisher
				publisherId = crypto.randomUUID();
				const newPublisher: Publisher = {
					id: publisherId,
					name: aiReport.name, // Use original case from AI
					createdAt: new Date()
				};
				newPublishers.push(newPublisher);
				publisherMap.set(normalizedName, publisherId);
			} else {
				// Use existing publisher
				publisherId = publisherMap.get(normalizedName)!;
			}

			// Create report
			const report: Report = {
				id: crypto.randomUUID(),
				publisherId,
				active: aiReport.isActive,
				hours: aiReport.hours,
				studies: aiReport.studies,
				comment: aiReport.comment || '',
				updatedAt: new Date()
			};
			reports.push(report);

			// Store metadata (not persisted)
			metadata.set(publisherId, {
				originalText: aiReport.originalText,
				matchConfidence: aiReport.matchConfidence,
				reportedBy: aiReport.reportedBy,
				reasoning: aiReport.reasoning
			});
		});

		return {
			newPublishers,
			reports,
			metadata,
			globalReasoning: aiResponse.reasoning
		};
	}
}
