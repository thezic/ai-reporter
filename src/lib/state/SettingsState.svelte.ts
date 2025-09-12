import { LocalStorageService } from '$lib/services/LocalStorageService';
import type { Settings, LegacySettings, AIProviderConfig } from '$lib/types';
import type { SupportedLanguage } from '$lib/constants/languages';
import { AIService } from '$lib/services/AIService';
import type { ConnectionTestResult } from '$lib/services/providers/AIProviderInterface';
import { getDefaultProvider, getProviderById } from '$lib/constants/aiProviders';

export class SettingsState {
	// New AI provider configuration
	aiProvider = $state<AIProviderConfig>({
		provider: 'openai',
		apiKey: '',
		model: 'gpt-4o',
		endpoint: 'https://api.openai.com/v1'
	});

	language = $state<SupportedLanguage>('en');
	
	// Connection testing state
	connectionStatus = $state<'idle' | 'testing' | 'success' | 'error'>('idle');
	connectionError = $state<string>('');

	// Provider-specific configurations storage
	private providerConfigs = $state<Map<string, AIProviderConfig>>(new Map());

	private storageService = new LocalStorageService();
	private readonly storageKey = 'ai-reporter-settings';
	private readonly legacyStorageKey = 'ai-reporter-settings'; // Same key for migration

	async loadSettings(): Promise<void> {
		const settings = await this.storageService.load(this.storageKey);
		
		if (settings) {
			// Check if this is the new format or legacy format
			if ('aiProvider' in settings && settings.aiProvider) {
				// New format
				this.aiProvider = { ...this.aiProvider, ...settings.aiProvider };
				this.language = (settings.language as SupportedLanguage) || 'en';
				
				// Load provider-specific configurations
				if (settings.providerConfigs) {
					this.providerConfigs.clear();
					Object.entries(settings.providerConfigs).forEach(([providerId, config]) => {
						this.providerConfigs.set(providerId, config);
					});
				}
			} else if ('aiApiKey' in settings && (settings as any).aiApiKey !== undefined) {
				// Legacy format - migrate
				console.log('Migrating from legacy settings format');
				const legacySettings = settings as unknown as LegacySettings;
				const migratedConfig = this.migrateFromLegacySettings(legacySettings);
				this.aiProvider = migratedConfig;
				this.language = ((settings as any).language as SupportedLanguage) || 'en';
				
				// Store the migrated config in provider configs
				this.providerConfigs.set('openai', migratedConfig);
				
				// Save in new format
				await this.saveSettings();
			} else {
				// Default settings
				this.setDefaultSettings();
			}
		} else {
			this.setDefaultSettings();
		}
	}

	async saveSettings(): Promise<void> {
		// Store current provider config in provider configs
		this.providerConfigs.set(this.aiProvider.provider, { ...this.aiProvider });
		
		// Convert Map to Record for storage
		const providerConfigs: Record<string, AIProviderConfig> = {};
		this.providerConfigs.forEach((config, providerId) => {
			providerConfigs[providerId] = config;
		});

		const settings: Settings = {
			aiProvider: this.aiProvider,
			language: this.language,
			providerConfigs
		};
		await this.storageService.save(this.storageKey, settings);
	}

	/**
	 * Test connection to the current AI provider
	 */
	async testConnection(): Promise<void> {
		this.connectionStatus = 'testing';
		this.connectionError = '';

		try {
			const result = await AIService.testConnection(this.aiProvider);
			if (result.success) {
				this.connectionStatus = 'success';
			} else {
				this.connectionStatus = 'error';
				this.connectionError = result.error || 'Connection failed';
			}
		} catch (error) {
			this.connectionStatus = 'error';
			this.connectionError = error instanceof Error ? error.message : 'Unknown error';
		}
	}

	/**
	 * Switch to a different AI provider
	 */
	switchProvider(providerId: string): void {
		const providerInfo = getProviderById(providerId);
		
		if (!providerInfo) {
			console.error(`Unknown provider: ${providerId}`);
			return;
		}

		// Store current provider configuration before switching
		this.providerConfigs.set(this.aiProvider.provider, { ...this.aiProvider });

		// Check if we have a saved configuration for the new provider
		const savedConfig = this.providerConfigs.get(providerId);
		
		let newProvider: AIProviderConfig;
		
		if (savedConfig) {
			// Use saved configuration
			newProvider = { ...savedConfig };
		} else {
			// Create new configuration with defaults
			newProvider = {
				provider: providerId as any,
				apiKey: '',
				model: providerInfo.models[0] || '',
				endpoint: providerInfo.defaultEndpoint
			};
		}

		this.aiProvider = newProvider;
		this.connectionStatus = 'idle';
		this.connectionError = '';
	}

	/**
	 * Update a specific field in the AI provider config
	 */
	updateProviderConfig(updates: Partial<AIProviderConfig>): void {
		this.aiProvider = { ...this.aiProvider, ...updates };
		
		// Store updated configuration immediately
		this.providerConfigs.set(this.aiProvider.provider, { ...this.aiProvider });
		
		// Reset connection status when config changes
		if (this.connectionStatus !== 'idle') {
			this.connectionStatus = 'idle';
			this.connectionError = '';
		}
	}

	/**
	 * Reset connection status
	 */
	resetConnectionStatus(): void {
		this.connectionStatus = 'idle';
		this.connectionError = '';
	}

	/**
	 * Check if settings are valid for AI parsing
	 */
	isConfigured(): boolean {
		return !!(this.aiProvider.apiKey && this.aiProvider.model);
	}

	private migrateFromLegacySettings(legacySettings: LegacySettings): AIProviderConfig {
		return {
			provider: 'openai',
			apiKey: legacySettings.aiApiKey,
			model: 'gpt-4o', // Update from deprecated gpt-4.1
			endpoint: legacySettings.openaiEndpoint || 'https://api.openai.com/v1'
		};
	}

	private setDefaultSettings(): void {
		const defaultProvider = getDefaultProvider();
		this.aiProvider = {
			provider: 'openai',
			apiKey: '',
			model: defaultProvider.models[0],
			endpoint: defaultProvider.defaultEndpoint
		};
		this.language = 'en';
		
		// Initialize provider configs with default
		this.providerConfigs.clear();
		this.providerConfigs.set('openai', { ...this.aiProvider });
	}
}
