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
			await store.put(item);
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
				resolve(request.result.length > 0 ? request.result : null);
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
}
