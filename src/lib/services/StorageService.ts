export interface IStorageService<T> {
	save(key: string, data: T): Promise<void>;
	load(key: string): Promise<T | null>;
	delete(key: string): Promise<void>;
}
