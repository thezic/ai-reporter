export interface Publisher {
	id: string;
	name: string;
	createdAt: Date;
}

export interface Report {
	id: string;
	publisherId: string;
	active?: boolean;
	hours?: number;
	studies?: number;
	comment?: string;
	updatedAt: Date;
}

// AI Provider Configuration
export interface AIProviderConfig {
	provider: 'openai' | 'anthropic' | 'github';
	apiKey: string;
	model: string;
	endpoint?: string;

	// Future extensibility
	headers?: Record<string, string>;
}

// Provider metadata for UI
export interface AIProviderInfo {
	id: string;
	name: string;
	description?: string;
	models: string[];
	defaultEndpoint?: string;
	configFields: string[];
	isDefault?: boolean;
}

// Updated Settings interface
export interface Settings {
	aiProvider: AIProviderConfig;
	language: string;
	providerConfigs?: Record<string, AIProviderConfig>; // Provider-specific configurations
}

// Legacy Settings interface (for migration)
export interface LegacySettings {
	aiApiKey: string;
	openaiEndpoint: string;
	language: string;
}

export interface CombinedData {
	name: string;
	active?: boolean;
	hours?: number;
	studies?: number;
	comment?: string;
}
