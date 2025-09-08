import type { Settings } from '$lib/types';
import type { IStorageService } from './StorageService';

export class LocalStorageService implements IStorageService<Settings> {
	async save(key: string, data: Settings): Promise<void> {
		localStorage.setItem(key, JSON.stringify(data));
	}

	async load(key: string): Promise<Settings | null> {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	}

	async delete(key: string): Promise<void> {
		localStorage.removeItem(key);
	}
}
