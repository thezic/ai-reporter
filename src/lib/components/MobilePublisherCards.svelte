<script lang="ts">
	import PublisherCard from '$lib/components/PublisherCard.svelte';
	import SmartPublisherEntry from '$lib/components/SmartPublisherEntry.svelte';
	import type { Publisher, Report } from '$lib/types';
	import type { ReportMetadata } from '$lib/services/AIService';
	import type { CardViewState } from '$lib/state/CardViewState.svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		publishers: Publisher[];
		reports: Report[];
		isEditMode: boolean;
		reportMetadata: Map<string, ReportMetadata>;
		cardViewState: CardViewState;
		onToggleEditMode: () => void;
		onUpdateReport: (publisherId: string, data: Partial<Report>) => void;
		onUpdatePublisher: (publisherId: string, data: Partial<Publisher>) => void;
		onAddPublisher: (name: string) => Promise<void>;
		onAddPublishers: (names: string[]) => Promise<void>;
		onDeletePublisher: (publisherId: string) => void;
	}

	let {
		publishers,
		reports,
		isEditMode,
		reportMetadata,
		cardViewState,
		onToggleEditMode,
		onUpdateReport,
		onUpdatePublisher,
		onAddPublisher,
		onAddPublishers,
		onDeletePublisher
	}: Props = $props();

	function getReportForPublisher(publisherId: string): Report | undefined {
		return reports.find((r) => r.publisherId === publisherId);
	}

	function extractLastName(fullName: string): string {
		const parts = fullName.trim().split(/\s+/);
		return parts.length > 1 ? parts[parts.length - 1] : parts[0];
	}

	const sortedPublishers = $derived(
		[...publishers].sort((a, b) => {
			const lastNameA = extractLastName(a.name).toLowerCase();
			const lastNameB = extractLastName(b.name).toLowerCase();
			return lastNameA.localeCompare(lastNameB);
		})
	);
</script>

<div>
	<!-- Header with Edit Toggle -->
	<div class="mb-4 flex items-center justify-between px-2">
		<h2 class="text-lg font-semibold text-slate-900">Publishers</h2>
		<button
			onclick={onToggleEditMode}
			class={[
				'rounded-lg p-2.5 font-medium transition-all',
				isEditMode
					? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
					: 'bg-slate-700 text-white hover:bg-slate-800'
			]}
			title={isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
			aria-label={isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
		>
			<svg
				class="h-5 w-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
				></path>
			</svg>
		</button>
	</div>

	<!-- Smart Publisher Entry -->
	<div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
		<SmartPublisherEntry {publishers} {onAddPublisher} {onAddPublishers} />
	</div>

	<!-- Main Publishers Group -->
	<div class="overflow-hidden rounded-lg bg-white shadow-sm">
		{#each sortedPublishers as publisher, index (publisher.id)}
			<div animate:flip={{ duration: 400 }}>
				<PublisherCard
					{publisher}
					report={getReportForPublisher(publisher.id)}
					metadata={reportMetadata.get(publisher.id)}
					{isEditMode}
					isExpanded={cardViewState.isExpanded(publisher.id)}
					onToggleExpansion={cardViewState.toggleExpansion}
					{onUpdateReport}
					{onUpdatePublisher}
					{onDeletePublisher}
					isLast={index === sortedPublishers.length - 1}
				/>
			</div>
		{/each}
	</div>
</div>
