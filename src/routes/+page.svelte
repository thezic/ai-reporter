<script lang="ts">
	import { onMount } from 'svelte';
	import MainLayout from '$lib/components/MainLayout.svelte';
	import MessageInput from '$lib/components/MessageInput.svelte';
	import PublisherTable from '$lib/components/PublisherTable.svelte';
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import { AppState } from '$lib/state/AppState.svelte';
	import { AIService, type ParseResult, type ReportMetadata } from '$lib/services/AIService';
	import { ExportService } from '$lib/services/ExportService';
	import type { CombinedData } from '$lib/types';

	const appState = new AppState();
	const exportService = new ExportService();

	let messages = $state('');
	let isParsingMessages = $state(false);
	let reportMetadata = $state<Map<string, ReportMetadata>>(new Map());

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
			const parseResult: ParseResult = await aiService.parseMessages(
				messages,
				appState.publishers.publishers
			);

			// First, add any new publishers to the publisher list
			for (const newPublisher of parseResult.newPublishers) {
				await appState.publishers.addPublisherObject(newPublisher);
			}

			// Then, create/update reports for all publishers (existing + new)
			for (const report of parseResult.reports) {
				await appState.reports.updateReport(report.publisherId, {
					active: report.active,
					hours: report.hours,
					studies: report.studies,
					comment: report.comment
				});
			}

			// Store metadata temporarily (not persisted)
			reportMetadata = parseResult.metadata;

			messages = '';
		} catch (error) {
			appState.error = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			isParsingMessages = false;
		}
	}

	async function handleUpdateReport(
		publisherId: string,
		data: { active?: boolean; hours?: number; studies?: number; comment?: string }
	) {
		await appState.reports.updateReport(publisherId, data);
	}

	async function handleUpdatePublisher(publisherId: string, data: { name?: string }) {
		await appState.publishers.updatePublisher(publisherId, data);
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
				studies: report?.studies,
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
				class="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
			></div>
		</div>
	{:else}
		<div class="flex h-full gap-6">
			<!-- Left Column: Message Input & Actions -->
			<div class="w-96 flex-shrink-0 space-y-6">
				<MessageInput bind:value={messages} onInput={handleMessageInput} />

				<ActionButtons
					onParse={handleParseMessages}
					onExportCsv={handleExportCsv}
					onExportExcel={handleExportExcel}
					onClearReports={handleClearReports}
					isLoading={isParsingMessages}
					{canParse}
				/>
			</div>

			<!-- Right Column: Publisher Table -->
			<div class="h-full min-w-0 flex-1">
				<PublisherTable
					publishers={appState.publishers.publishers}
					reports={appState.reports.reports}
					isEditMode={appState.publishers.isEditMode}
					{reportMetadata}
					onToggleEditMode={handleToggleEditMode}
					onUpdateReport={handleUpdateReport}
					onUpdatePublisher={handleUpdatePublisher}
					onAddPublisher={handleAddPublisher}
					onDeletePublisher={handleDeletePublisher}
				/>
			</div>
		</div>

		{#if appState.error}
			<div
				class="fixed right-4 bottom-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-lg"
				role="alert"
			>
				<span class="block sm:inline">{appState.error}</span>
				<button
					onclick={appState.clearError}
					class="float-right pl-4 text-red-600 hover:text-red-800"
				>
					×
				</button>
			</div>
		{/if}
	{/if}
</MainLayout>
