/**
 * Central prompt management service
 * Provides shared prompts and templates for all AI providers
 */

import type { Publisher } from '$lib/types';
import { SYSTEM_PROMPT } from './systemPrompts';
import { createUserPrompt } from './promptTemplates';

export class PromptService {
	/**
	 * Get the standard system prompt for AI message parsing
	 */
	static getSystemPrompt(): string {
		return SYSTEM_PROMPT;
	}

	/**
	 * Create a user prompt with language-specific instructions
	 * @param messages - Message content to parse
	 * @param publishers - List of existing publishers
	 * @param language - Target output language
	 */
	static createUserPrompt(
		messages: string,
		publishers: Publisher[],
		language: string = 'en'
	): string {
		return createUserPrompt(messages, publishers, language);
	}

	/**
	 * Get both system and user prompts for a complete AI conversation
	 * @param messages - Message content to parse
	 * @param publishers - List of existing publishers
	 * @param language - Target output language
	 */
	static getPrompts(
		messages: string,
		publishers: Publisher[],
		language: string = 'en'
	): { systemPrompt: string; userPrompt: string } {
		return {
			systemPrompt: this.getSystemPrompt(),
			userPrompt: this.createUserPrompt(messages, publishers, language)
		};
	}
}
