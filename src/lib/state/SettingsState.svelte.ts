import { LocalStorageService } from '$lib/services/LocalStorageService';
import type { Settings } from '$lib/types';

export class SettingsState {
	aiApiKey = $state('');
	private storageService = new LocalStorageService();
	private readonly storageKey = 'ai-reporter-settings';

	async loadSettings(): Promise<void> {
		const settings = await this.storageService.load(this.storageKey);
		if (settings) {
			this.aiApiKey = settings.aiApiKey;
		}
	}

	async saveSettings(): Promise<void> {
		const settings: Settings = {
			aiApiKey: this.aiApiKey
		};
		await this.storageService.save(this.storageKey, settings);
	}
}
