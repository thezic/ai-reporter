import { IndexedDBService } from '$lib/services/IndexedDBService';
import type { Publisher } from '$lib/types';

export class PublisherState {
	publishers = $state<Publisher[]>([]);
	isEditMode = $state(false);
	private storageService = new IndexedDBService();

	async loadPublishers(): Promise<void> {
		const publishers = (await this.storageService.load('publishers')) as Publisher[] | null;
		if (publishers) {
			this.publishers = publishers;
		}
	}

	async savePublishers(): Promise<void> {
		await this.storageService.save('publishers', this.publishers);
	}

	async addPublishers(names: string[]): Promise<void> {
		const newPublishers: Publisher[] = names.map((name) => ({
			id: crypto.randomUUID(),
			name: name.trim(),
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			createdAt: new Date()
		}));

		this.publishers = [...this.publishers, ...newPublishers];
		await this.savePublishers();
	}

	async addPublisherObject(publisher: Publisher): Promise<void> {
		this.publishers = [...this.publishers, publisher];
		await this.savePublishers();
	}

	async deletePublisher(id: string): Promise<void> {
		this.publishers = this.publishers.filter((p) => p.id !== id);
		await this.savePublishers();
	}

	async updatePublisher(id: string, data: Partial<Publisher>): Promise<void> {
		const index = this.publishers.findIndex((p) => p.id === id);
		if (index !== -1) {
			const updatedPublishers = [...this.publishers];
			updatedPublishers[index] = { ...updatedPublishers[index], ...data };
			this.publishers = updatedPublishers;
			await this.savePublishers();
		}
	}

	toggleEditMode(): void {
		this.isEditMode = !this.isEditMode;
	}
}
