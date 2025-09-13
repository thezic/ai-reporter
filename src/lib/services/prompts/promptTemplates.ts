/**
 * Dynamic prompt templates for AI message parsing
 * Handles language-specific instructions and data formatting
 */

import type { Publisher } from '$lib/types';
import { getTranslation } from '$lib/constants/languages';

/**
 * Creates a user prompt for AI message parsing
 * @param messages - The message content to parse
 * @param publishers - List of existing publishers for matching
 * @param language - Output language code (defaults to English)
 * @returns Formatted user prompt with language instructions
 */
export function createUserPrompt(
	messages: string,
	publishers: Publisher[],
	language: string = 'en'
): string {
	const publisherNames = publishers.map((p) => p.name);
	const translation = getTranslation(language);

	return `Extract data from the following message data:
<data>${messages}</data>

using this list with publisher names:
<publishers>${JSON.stringify(publisherNames)}</publishers>

IMPORTANT: Output all text content (names, comments, reasoning) in ${translation.ai.languageInstruction}.`;
}
