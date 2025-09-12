import type { AIProviderInfo } from '$lib/types';

export const AI_PROVIDERS: Record<string, AIProviderInfo> = {
	openai: {
		id: 'openai',
		name: 'OpenAI',
		description: 'Most Popular',
		models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4'],
		defaultEndpoint: 'https://api.openai.com/v1',
		configFields: ['apiKey', 'model', 'endpoint'],
		isDefault: true
	},
	anthropic: {
		id: 'anthropic',
		name: 'Anthropic (Claude)',
		description: 'Best Reasoning',
		models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
		defaultEndpoint: 'https://api.anthropic.com',
		configFields: ['apiKey', 'model']
	},
	azure: {
		id: 'azure',
		name: 'Azure OpenAI',
		description: 'Enterprise Ready',
		models: [], // Dynamic based on deployment
		configFields: ['apiKey', 'resourceName', 'deploymentName', 'apiVersion']
	},
	github: {
		id: 'github',
		name: 'GitHub Models',
		description: 'Developer Friendly',
		models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
		defaultEndpoint: 'https://models.inference.ai.azure.com',
		configFields: ['apiKey', 'model']
	}
};

export const AZURE_API_VERSIONS = [
	'2024-02-01',
	'2023-12-01-preview', 
	'2023-05-15'
];

export const getProviderById = (id: string): AIProviderInfo | undefined => {
	return AI_PROVIDERS[id];
};

export const getAvailableProviders = (): AIProviderInfo[] => {
	return Object.values(AI_PROVIDERS);
};

export const getDefaultProvider = (): AIProviderInfo => {
	return AI_PROVIDERS.openai;
};