import { PublisherState } from './PublisherState.svelte';
import { ReportState } from './ReportState.svelte';
import { SettingsState } from './SettingsState.svelte';

export class AppState {
	publishers: PublisherState;
	reports: ReportState;
	settings: SettingsState;

	isLoading = $state(false);
	error = $state<string | null>(null);

	constructor() {
		this.publishers = new PublisherState();
		this.reports = new ReportState();
		this.settings = new SettingsState();
	}

	async init(): Promise<void> {
		this.isLoading = true;
		try {
			await Promise.all([
				this.publishers.loadPublishers(),
				this.reports.loadReports(),
				this.settings.loadSettings()
			]);
		} catch (error) {
			this.error = error instanceof Error ? error.message : 'Failed to initialize app';
		} finally {
			this.isLoading = false;
		}
	}

	clearError(): void {
		this.error = null;
	}
}
