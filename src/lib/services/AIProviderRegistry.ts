import type { AIProviderConfig } from '$lib/types';
import type { AIProvider } from './providers/AIProviderInterface';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { AnthropicProvider } from './providers/AnthropicProvider';
import { GitHubModelsProvider } from './providers/GitHubModelsProvider';

export class AIProviderRegistry {
	private providers = new Map<string, () => AIProvider>();

	constructor() {
		this.registerDefaultProviders();
	}

	private registerDefaultProviders(): void {
		this.registerProvider('openai', () => new OpenAIProvider());
		this.registerProvider('anthropic', () => new AnthropicProvider());
		this.registerProvider('github', () => new GitHubModelsProvider());
	}

	/**
	 * Register a provider factory function
	 */
	registerProvider(type: string, factory: () => AIProvider): void {
		this.providers.set(type, factory);
	}

	/**
	 * Get a provider instance by type
	 */
	getProvider(type: string): AIProvider {
		const factory = this.providers.get(type);
		if (!factory) {
			throw new Error(`Unknown AI provider: ${type}`);
		}
		return factory();
	}

	/**
	 * Get all available provider types
	 */
	getAvailableProviders(): string[] {
		return Array.from(this.providers.keys());
	}

	/**
	 * Create a configured AI service instance
	 */
	createService(config: AIProviderConfig): AIProvider {
		const provider = this.getProvider(config.provider);
		provider.configure(config);
		return provider;
	}

	/**
	 * Validate if a provider type is supported
	 */
	isProviderSupported(type: string): boolean {
		return this.providers.has(type);
	}
}

// Global registry instance
export const aiProviderRegistry = new AIProviderRegistry();
