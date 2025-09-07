<script lang="ts">
	import { onMount } from 'svelte';
	import MainLayout from '$lib/components/MainLayout.svelte';
	import MessageInput from '$lib/components/MessageInput.svelte';
	import PublisherTable from '$lib/components/PublisherTable.svelte';
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import { AppState } from '$lib/state/AppState.svelte';
	import { AIService } from '$lib/services/AIService';
	import { ExportService } from '$lib/services/ExportService';
	import type { CombinedData } from '$lib/types';

	const appState = new AppState();
	const exportService = new ExportService();

	let messages = $state('');
	let isParsingMessages = $state(false);

	onMount(async () => {
		await appState.init();
	});

	async function handleParseMessages() {
		if (!messages.trim()) return;

		if (!appState.settings.aiApiKey) {
			alert('Please configure your AI API key in settings first.');
			return;
		}

		isParsingMessages = true;
		try {
			const aiService = new AIService(appState.settings.aiApiKey);
			const parsedReports = await aiService.parseMessages(messages, appState.publishers.publishers);

			for (const report of parsedReports) {
				await appState.reports.updateReport(report.publisherId, {
					active: report.active,
					hours: report.hours,
					comment: report.comment
				});
			}

			messages = '';
		} catch (error) {
			alert(
				`Failed to parse messages: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			isParsingMessages = false;
		}
	}

	async function handleUpdateReport(
		publisherId: string,
		data: { active?: boolean; hours?: number; comment?: string }
	) {
		await appState.reports.updateReport(publisherId, data);
	}

	async function handleAddPublisher(name: string) {
		await appState.publishers.addPublisher(name);
	}

	async function handleDeletePublisher(publisherId: string) {
		await appState.publishers.deletePublisher(publisherId);
		await appState.reports.deleteReportsByPublisher(publisherId);
	}

	function handleToggleEditMode() {
		appState.publishers.toggleEditMode();
	}

	function getCombinedData(): CombinedData[] {
		return appState.publishers.publishers.map((publisher) => {
			const report = appState.reports.getReportByPublisher(publisher.id);
			return {
				name: publisher.name,
				active: report?.active,
				hours: report?.hours,
				comment: report?.comment
			};
		});
	}

	function handleExportCsv() {
		const data = getCombinedData();
		exportService.exportToCsv(data);
	}

	function handleExportExcel() {
		const data = getCombinedData();
		exportService.exportToExcel(data);
	}

	async function handleClearReports() {
		const confirmed = confirm(
			'This will clear all report data (active status, hours, and comments) but keep publisher names. Are you sure?'
		);
		if (confirmed) {
			await appState.reports.clearReportsData();
		}
	}

	function handleMessageInput(value: string) {
		messages = value;
	}

	const canParse = $derived(messages.trim().length > 0 && !!appState.settings.aiApiKey);
</script>

<MainLayout>
	{#if appState.isLoading}
		<div class="flex items-center justify-center py-8">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
			></div>
		</div>
	{:else}
		<div class="space-y-6">
			<MessageInput bind:value={messages} onInput={handleMessageInput} />

			<ActionButtons
				onParse={handleParseMessages}
				onExportCsv={handleExportCsv}
				onExportExcel={handleExportExcel}
				onClearReports={handleClearReports}
				isLoading={isParsingMessages}
				{canParse}
			/>

			<PublisherTable
				publishers={appState.publishers.publishers}
				reports={appState.reports.reports}
				isEditMode={appState.publishers.isEditMode}
				onToggleEditMode={handleToggleEditMode}
				onUpdateReport={handleUpdateReport}
				onAddPublisher={handleAddPublisher}
				onDeletePublisher={handleDeletePublisher}
			/>
		</div>

		{#if appState.error}
			<div
				class="fixed right-4 bottom-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
				role="alert"
			>
				<span class="block sm:inline">{appState.error}</span>
				<button
					onclick={appState.clearError}
					class="float-right pl-4 text-red-500 hover:text-red-700"
				>
					×
				</button>
			</div>
		{/if}
	{/if}
</MainLayout>
