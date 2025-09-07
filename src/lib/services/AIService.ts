import OpenAI from 'openai';
import type { Publisher, Report } from '$lib/types';

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

	async parseMessages(messages: string, publishers: Publisher[]): Promise<Report[]> {
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
			return this.convertAIResponseToReports(aiResponse, publishers);
		} catch (error) {
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
- The array must include all known publishers, even if they haven't given any report.

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

	private convertAIResponseToReports(aiResponse: AIResponse, publishers: Publisher[]): Report[] {
		return aiResponse.reports.map((aiReport) => {
			let publisherId: string;

			if (aiReport.isNew) {
				publisherId = crypto.randomUUID();
			} else {
				const publisher = publishers.find(
					(p) => p.name.toLowerCase() === aiReport.name.toLowerCase()
				);
				publisherId = publisher?.id || crypto.randomUUID();
			}

			return {
				id: crypto.randomUUID(),
				publisherId,
				active: aiReport.isActive,
				hours: aiReport.hours,
				comment: aiReport.comment || '',
				updatedAt: new Date()
			};
		});
	}
}
