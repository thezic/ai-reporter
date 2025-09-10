export interface Publisher {
	id: string;
	name: string;
	createdAt: Date;
}

export interface Report {
	id: string;
	publisherId: string;
	active?: boolean;
	hours?: number;
	studies?: number;
	comment?: string;
	updatedAt: Date;
}

export interface Settings {
	aiApiKey: string;
	openaiEndpoint: string;
	language: string;
}

export interface CombinedData {
	name: string;
	active?: boolean;
	hours?: number;
	studies?: number;
	comment?: string;
}
