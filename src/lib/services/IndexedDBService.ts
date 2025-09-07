import type { Publisher, Report } from '$lib/types';
import type { IStorageService } from './StorageService';

export class IndexedDBService implements IStorageService<Publisher[] | Report[]> {
	private dbName = 'AIReporterDB';
	private dbVersion = 1;
	private db: IDBDatabase | null = null;

	async init(): Promise<void> {
		if (this.db) return;

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.dbVersion);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = () => {
				const db = request.result;

				if (!db.objectStoreNames.contains('publishers')) {
					const publishersStore = db.createObjectStore('publishers', { keyPath: 'id' });
					publishersStore.createIndex('name', 'name', { unique: false });
				}

				if (!db.objectStoreNames.contains('reports')) {
					const reportsStore = db.createObjectStore('reports', { keyPath: 'id' });
					reportsStore.createIndex('publisherId', 'publisherId', { unique: false });
				}
			};
		});
	}

	async save(storeName: string, data: Publisher[] | Report[]): Promise<void> {
		await this.init();
		if (!this.db) throw new Error('Database not initialized');

		const transaction = this.db.transaction([storeName], 'readwrite');
		const store = transaction.objectStore(storeName);

		await store.clear();
		for (const item of data) {
			// Serialize Date objects to strings for IndexedDB storage
			const serializedItem = this.serializeItem(item);
			await store.put(serializedItem);
		}

		return new Promise((resolve, reject) => {
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
		});
	}

	async load(storeName: string): Promise<Publisher[] | Report[] | null> {
		await this.init();
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([storeName], 'readonly');
			const store = transaction.objectStore(storeName);
			const request = store.getAll();

			request.onsuccess = () => {
				if (request.result.length === 0) {
					resolve(null);
				} else {
					// Deserialize Date strings back to Date objects
					const deserializedItems = request.result.map((item) => this.deserializeItem(item)) as
						| Publisher[]
						| Report[];
					resolve(deserializedItems);
				}
			};
			request.onerror = () => reject(request.error);
		});
	}

	async delete(storeName: string): Promise<void> {
		await this.init();
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([storeName], 'readwrite');
			const store = transaction.objectStore(storeName);
			const request = store.clear();

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	private serializeItem(item: Publisher | Report): Record<string, unknown> {
		const serialized = { ...item } as Record<string, unknown>;

		// Convert Date objects to ISO strings
		if ('createdAt' in serialized && serialized.createdAt instanceof Date) {
			serialized.createdAt = serialized.createdAt.toISOString();
		}
		if ('updatedAt' in serialized && serialized.updatedAt instanceof Date) {
			serialized.updatedAt = serialized.updatedAt.toISOString();
		}

		return serialized;
	}

	private deserializeItem(item: Record<string, unknown>): Publisher | Report {
		const deserialized = { ...item };

		// Convert ISO strings back to Date objects
		if ('createdAt' in deserialized && typeof deserialized.createdAt === 'string') {
			deserialized.createdAt = new Date(deserialized.createdAt);
		}
		if ('updatedAt' in deserialized && typeof deserialized.updatedAt === 'string') {
			deserialized.updatedAt = new Date(deserialized.updatedAt);
		}

		return deserialized as unknown as Publisher | Report;
	}
}
