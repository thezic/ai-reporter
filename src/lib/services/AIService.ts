import type { Publisher, Report, AIProviderConfig } from '$lib/types';
import type { AIProvider, ConnectionTestResult } from './providers/AIProviderInterface';
import { aiProviderRegistry } from './AIProviderRegistry';

export interface ReportMetadata {
	originalText?: string;
	matchConfidence: 'high' | 'medium' | 'low';
	reportedBy: string;
	reasoning: string;
}

export interface ParseResult {
	newPublishers: Publisher[];
	reports: Report[];
	metadata: Map<string, ReportMetadata>; // publisherId -> metadata
	globalReasoning: string;
}

export class AIService {
	private provider: AIProvider;

	constructor(config: AIProviderConfig) {
		this.provider = aiProviderRegistry.createService(config);
	}

	/**
	 * Legacy constructor for backward compatibility
	 */
	static fromLegacyConfig(apiKey: string, endpoint: string): AIService {
		const config: AIProviderConfig = {
			provider: 'openai',
			apiKey,
			model: 'gpt-4o', // Updated from deprecated gpt-4.1
			endpoint
		};
		return new AIService(config);
	}

	async parseMessages(
		messages: string,
		publishers: Publisher[],
		language: string = 'en'
	): Promise<ParseResult> {
		return this.provider.parseMessages(messages, publishers, language);
	}

	/**
	 * Test connection to the AI provider
	 */
	async testConnection(): Promise<ConnectionTestResult> {
		// Since we don't store the config in this service, we need to get it from the provider
		// This is a limitation of the current design. In practice, this method would be called
		// from SettingsState which has access to the config.
		throw new Error('Use testConnection on SettingsState instead');
	}

	/**
	 * Get the provider name
	 */
	getProviderName(): string {
		return this.provider.name;
	}

	/**
	 * Static method to test connection with config
	 */
	static async testConnection(config: AIProviderConfig): Promise<ConnectionTestResult> {
		const provider = aiProviderRegistry.getProvider(config.provider);
		return provider.testConnection(config);
	}
}
