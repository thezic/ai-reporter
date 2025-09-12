import type { AIProviderConfig, Publisher } from '$lib/types';
import type { ParseResult } from '$lib/services/AIService';

export interface ConnectionTestResult {
	success: boolean;
	error?: string;
}

export interface AIProvider {
	readonly name: string;

	/**
	 * Validates the provider configuration
	 */
	validateConfig(config: AIProviderConfig): boolean;

	/**
	 * Tests connection to the AI provider
	 */
	testConnection(config: AIProviderConfig): Promise<ConnectionTestResult>;

	/**
	 * Creates the provider-specific client instance
	 */
	createClient(config: AIProviderConfig): any;

	/**
	 * Parses messages using the AI provider
	 */
	parseMessages(
		messages: string,
		publishers: Publisher[],
		language: string
	): Promise<ParseResult>;

	/**
	 * Configure the provider with settings
	 */
	configure(config: AIProviderConfig): void;
}