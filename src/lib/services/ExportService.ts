import type { CombinedData } from '$lib/types';

export class ExportService {
	exportToCsv(data: CombinedData[]): void {
		const headers = ['Name', 'Active', 'Hours', 'Comment'];
		const csvContent = [
			headers.join(','),
			...data.map((row) =>
				[
					this.escapeCSV(row.name),
					row.active === undefined ? '' : row.active ? 'Yes' : 'No',
					row.hours ?? '',
					this.escapeCSV(row.comment || '')
				].join(',')
			)
		].join('\n');

		this.downloadFile(csvContent, 'ai-reporter-data.csv', 'text/csv');
	}

	exportToExcel(data: CombinedData[]): void {
		const headers = ['Name', 'Active', 'Hours', 'Comment'];

		let excelContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>AI Reporter Data</Title>
 </DocumentProperties>
 <Worksheet ss:Name="Publishers">
  <Table>
   <Row>`;

		headers.forEach((header) => {
			excelContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
		});
		excelContent += '</Row>';

		data.forEach((row) => {
			excelContent += '<Row>';
			excelContent += `<Cell><Data ss:Type="String">${this.escapeXML(row.name)}</Data></Cell>`;
			excelContent += `<Cell><Data ss:Type="String">${
				row.active === undefined ? '' : row.active ? 'Yes' : 'No'
			}</Data></Cell>`;
			excelContent += `<Cell><Data ss:Type="Number">${row.hours ?? ''}</Data></Cell>`;
			excelContent += `<Cell><Data ss:Type="String">${this.escapeXML(
				row.comment || ''
			)}</Data></Cell>`;
			excelContent += '</Row>';
		});

		excelContent += `
  </Table>
 </Worksheet>
</Workbook>`;

		this.downloadFile(excelContent, 'ai-reporter-data.xls', 'application/vnd.ms-excel');
	}

	private escapeCSV(value: string): string {
		if (value.includes(',') || value.includes('"') || value.includes('\n')) {
			return '"' + value.replace(/"/g, '""') + '"';
		}
		return value;
	}

	private escapeXML(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
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
