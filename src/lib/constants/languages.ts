export const SUPPORTED_LANGUAGES = {
	en: 'English',
	sv: 'Svenska',
	es: 'Español',
	lv: 'Latviešu'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export interface LanguageTranslations {
	export: {
		headers: [string, string, string, string, string]; // Ensures exactly 5 headers
		values: {
			yes: string;
			no: string;
			empty: string;
		};
	};
	ai: {
		languageInstruction: string; // What to tell AI for output language
	};
}

export const TRANSLATIONS: Record<SupportedLanguage, LanguageTranslations> = {
	en: {
		export: {
			headers: ['Name', 'Active', 'Hours', 'Studies', 'Comment'],
			values: { yes: 'Yes', no: 'No', empty: '' }
		},
		ai: { languageInstruction: 'English' }
	},
	sv: {
		export: {
			headers: ['Namn', 'Aktiv', 'Timmar', 'Studier', 'Kommentar'],
			values: { yes: 'Ja', no: 'Nej', empty: '' }
		},
		ai: { languageInstruction: 'Swedish' }
	},
	es: {
		export: {
			headers: ['Nombre', 'Activo', 'Horas', 'Estudios', 'Comentario'],
			values: { yes: 'Sí', no: 'No', empty: '' }
		},
		ai: { languageInstruction: 'Spanish' }
	},
	lv: {
		export: {
			headers: ['Vārds', 'Aktīvs', 'Stundas', 'Studijas', 'Komentārs'],
			values: { yes: 'Jā', no: 'Nē', empty: '' }
		},
		ai: { languageInstruction: 'Latvian' }
	}
};

// Helper function to get translation with fallback
export function getTranslation(language: string): LanguageTranslations {
	return TRANSLATIONS[language as SupportedLanguage] ?? TRANSLATIONS.en;
}
