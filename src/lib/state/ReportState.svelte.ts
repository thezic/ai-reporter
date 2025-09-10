import { IndexedDBService } from '$lib/services/IndexedDBService';
import type { Report } from '$lib/types';

export class ReportState {
	reports = $state<Report[]>([]);
	private storageService = new IndexedDBService();

	async loadReports(): Promise<void> {
		const reports = (await this.storageService.load('reports')) as Report[] | null;
		if (reports) {
			this.reports = reports;
		}
	}

	async saveReports(): Promise<void> {
		await this.storageService.save('reports', this.reports);
	}

	async updateReport(
		publisherId: string,
		data: Partial<Pick<Report, 'active' | 'hours' | 'studies' | 'comment'>>
	): Promise<void> {
		const existingIndex = this.reports.findIndex((r) => r.publisherId === publisherId);

		if (existingIndex !== -1) {
			// Update existing report with proper reactivity
			const updatedReports = [...this.reports];
			updatedReports[existingIndex] = {
				...updatedReports[existingIndex],
				...data,
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				updatedAt: new Date()
			};
			this.reports = updatedReports;
		} else {
			// Add new report with proper reactivity
			const newReport: Report = {
				id: crypto.randomUUID(),
				publisherId,
				...data,
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				updatedAt: new Date()
			};
			this.reports = [...this.reports, newReport];
		}
		await this.saveReports();
	}

	async clearReportsData(): Promise<void> {
		this.reports = this.reports.map((report) => ({
			...report,
			active: undefined,
			hours: undefined,
			studies: undefined,
			comment: undefined,
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			updatedAt: new Date()
		}));
		await this.saveReports();
	}

	getReportByPublisher(publisherId: string): Report | undefined {
		return this.reports.find((r) => r.publisherId === publisherId);
	}

	async deleteReportsByPublisher(publisherId: string): Promise<void> {
		this.reports = this.reports.filter((r) => r.publisherId !== publisherId);
		await this.saveReports();
	}
}
