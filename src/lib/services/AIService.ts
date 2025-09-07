import OpenAI from 'openai';
import type { Publisher, Report } from '$lib/types';

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

export class AIService {
	private openai: OpenAI;

	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error('AI API key not configured');
		}
		this.openai = new OpenAI({
			baseURL: 'https://models.github.ai/inference',
			apiKey: apiKey,
			dangerouslyAllowBrowser: true
		});
	}

	async parseMessages(messages: string, publishers: Publisher[]): Promise<ParseResult> {
		const publisherNames = publishers.map((p) => p.name);

		const userPrompt = `Extract data from the following message data:
<data>${messages}</data>

using this list with publisher names:
<publishers>${JSON.stringify(publisherNames)}</publishers>`;

		try {
			const completion = await this.openai.chat.completions.create({
				model: 'gpt-4.1',
				messages: [
					{
						role: 'system',
						content: this.getSystemPrompt()
					},
					{
						role: 'user',
						content: userPrompt
					}
				],
				temperature: 0.1,
				max_tokens: 4000
			});

			const content = completion.choices[0]?.message?.content;

			if (!content) {
				throw new Error('No response from AI service');
			}

			const aiResponse: AIResponse = JSON.parse(content);
			return this.convertAIResponseToParseResult(aiResponse, publishers);
		} catch (error) {
			// Handle specific OpenAI/AI provider errors
			if (error && typeof error === 'object' && 'status' in error) {
				const status = (error as any).status;
				const message = (error as any).message || 'Unknown AI service error';

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
						throw new Error('AI service is temporarily unavailable. Please try again later.');
					case 502:
					case 503:
					case 504:
						throw new Error(
							'AI service is experiencing issues. Please try again in a few minutes.'
						);
					default:
						throw new Error(`AI service error (${status}): ${message}`);
				}
			}

			// Handle JSON parsing errors
			if (error instanceof SyntaxError) {
				throw new Error('Invalid response format from AI service. Please try again.');
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

	private getSystemPrompt(): string {
		return `You are a helpful assistant that extracts report data from messages.

A report consists of the following fields:

<report>
<field name="name" description="The name of the publisher" />
<field name="isActive" description="Whether a publisher have given a report or not, and therefore can be counted as active or not" />
<field name="hours" description="The number of hours the publisher have used in service. It's not mandatory and can be left blank" />
<field name="studies" description="How many bible studies the publisher have. It's not mandatory and can be left blank" />
<field name="comment" description="Any data that belongs to the report, that doesn't belong to the other fields, such as how many bethel hours or information about any other activities." />

A report can also contain extra metadata, such as the original text for the report, and if it's a new publisher, that couldn't be matched against the existing list with names.
</report>

- Every report must be matched against a list with publishers.
- Make a best effort to match the reports to the names.
- Sometimes a publisher can give reports for his or her whole family.
- If a report cannot be matched against the existing list with publishers, it might be a new publisher. It should be included in the list of reports.

MATCHING RULES:
1. Primary matching: Exact name match (case-insensitive)
2. Fuzzy matching: Allow for typos, missing diacritics, nickname variations
3. Family reporting patterns:
   - "No [Name]:" or "From [Name]:" indicates family head reporting
   - "Visi sludināja" or "All preached" means all family members were active
   - List items after a family head's introduction belong to that family
4. If confidence in matching is low, mark as potentially new publisher
5. Always include reasoning for difficult matches in the reasoning field

FAMILY MEMBER DETECTION:
- Check for shared surnames in the publisher list
- Use Fuzzy matching when comparing family names, for example Dālbergs and Dālberga is the same family name.
- Look for contextual indicators of family relationships
- When family head reports for others, distribute the information appropriately

<output>
- The reports array must be sorted by publisher family name.
- The comment should never contain the original message. It's only used for extra information such as bethel work, sickness, conventions, etc...
- IMPORTANT: Only include publishers who have actually given a report or are explicitly mentioned with activity data in the message.
- Do NOT include publishers who are only in the provided publisher names list but have no corresponding report data in the message.
- If a publisher is not mentioned in the message data, do not include them in the reports array.

Output should be formatted as json such as this:

<example>
{
    "reports": [
        {"name": "Kalle Johansson", "isActive":true, "hours":25, "studies": 3, "comment": "Beteljobb 10h, sjuk 1d", "originalText": "Kalle: 25h, 3 studies, beteljobb 10h, sjuk 1d", "isNew": false, "matchConfidence": "high", "reportedBy": "self", "reasoning": "Here, describe how you have been thinking when filling this report"}
    ],
   "reasoning": "Here, describe how you have been thinking when filing the reports"
}
</example>
</output>`;
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
