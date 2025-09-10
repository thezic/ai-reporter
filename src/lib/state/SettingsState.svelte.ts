import { LocalStorageService } from '$lib/services/LocalStorageService';
import type { Settings } from '$lib/types';

export class SettingsState {
	aiApiKey = $state('');
	openaiEndpoint = $state('https://models.github.ai/inference');
	private storageService = new LocalStorageService();
	private readonly storageKey = 'ai-reporter-settings';

	async loadSettings(): Promise<void> {
		const settings = await this.storageService.load(this.storageKey);
		if (settings) {
			this.aiApiKey = settings.aiApiKey;
			this.openaiEndpoint = settings.openaiEndpoint || 'https://models.github.ai/inference';
		}
	}

	async saveSettings(): Promise<void> {
		const settings: Settings = {
			aiApiKey: this.aiApiKey,
			openaiEndpoint: this.openaiEndpoint
		};
		await this.storageService.save(this.storageKey, settings);
	}
}
