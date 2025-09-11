import type { CombinedData } from '$lib/types';
import * as XLSX from 'xlsx';
import { getTranslation } from '$lib/constants/languages';

export class ExportService {
	exportToCsv(data: CombinedData[], language: string = 'en'): void {
		const translation = getTranslation(language);
		const headers = translation.export.headers;
		const csvContent = [
			headers.join(','),
			...data.map((row) =>
				[
					this.escapeCSV(row.name),
					row.active === undefined
						? translation.export.values.empty
						: row.active
							? translation.export.values.yes
							: translation.export.values.no,
					row.hours ?? translation.export.values.empty,
					row.studies ?? translation.export.values.empty,
					this.escapeCSV(row.comment || translation.export.values.empty)
				].join(',')
			)
		].join('\n');

		this.downloadFile(csvContent, `ai-reporter-data-${language}.csv`, 'text/csv');
	}

	exportToExcel(data: CombinedData[], language: string = 'en'): void {
		const translation = getTranslation(language);
		// Create workbook and worksheet
		const workbook = XLSX.utils.book_new();

		// Prepare data with headers
		const headers = translation.export.headers;
		const worksheetData = [
			headers,
			...data.map((row) => [
				row.name,
				row.active === undefined
					? translation.export.values.empty
					: row.active
						? translation.export.values.yes
						: translation.export.values.no,
				row.hours ?? translation.export.values.empty,
				row.studies ?? translation.export.values.empty,
				row.comment || translation.export.values.empty
			])
		];

		// Create worksheet from data
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

		// Set column widths for better formatting
		worksheet['!cols'] = [
			{ width: 25 }, // Name
			{ width: 10 }, // Active
			{ width: 10 }, // Hours
			{ width: 10 }, // Studies
			{ width: 40 } // Comment
		];

		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Publishers');

		// Generate Excel file and download
		XLSX.writeFile(workbook, `ai-reporter-data-${language}.xlsx`);
	}

	private escapeCSV(value: string): string {
		if (value.includes(',') || value.includes('"') || value.includes('\n')) {
			return '"' + value.replace(/"/g, '""') + '"';
		}
		return value;
	}

	private downloadFile(content: string, filename: string, mimeType: string): void {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.style.display = 'none';

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	}
}
