<script lang="ts">
	import TableRow from '$lib/components/TableRow.svelte';
	import type { Publisher, Report } from '$lib/types';
	import type { ReportMetadata } from '$lib/services/AIService';
	import { flip } from 'svelte/animate';

	interface Props {
		publishers: Publisher[];
		reports: Report[];
		isEditMode: boolean;
		reportMetadata: Map<string, ReportMetadata>;
		onToggleEditMode: () => void;
		onUpdateReport: (publisherId: string, data: Partial<Report>) => void;
		onUpdatePublisher: (publisherId: string, data: Partial<Publisher>) => void;
		onAddPublisher: (name: string) => void;
		onDeletePublisher: (publisherId: string) => void;
	}

	let {
		publishers,
		reports,
		isEditMode,
		reportMetadata,
		onToggleEditMode,
		onUpdateReport,
		onUpdatePublisher,
		onAddPublisher,
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

	function getTooltipContent(publisherId: string): string {
		const metadata = reportMetadata.get(publisherId);
		if (!metadata) return '';

		const parts = [];
		if (metadata.originalText) parts.push(`Original: ${metadata.originalText}`);
		parts.push(`Confidence: ${metadata.matchConfidence}`);
		parts.push(`Reported by: ${metadata.reportedBy}`);
		if (metadata.reasoning) parts.push(`Reasoning: ${metadata.reasoning}`);

		return parts.join('\n');
	}
</script>

<div
	class="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200"
>
	<!-- Sticky Header -->
	<div
		class="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4"
	>
		<h2 class="text-lg font-semibold text-slate-900">Publishers</h2>
		<button
			onclick={onToggleEditMode}
			class={`rounded-lg p-2.5 font-medium transition-all ${
				isEditMode
					? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
					: 'bg-slate-700 text-white hover:bg-slate-800'
			}`}
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

	<!-- Scrollable Table Container -->
	<div class="flex-1 overflow-auto">
		<table class="w-full">
			<!-- Sticky Table Header -->
			<thead class="sticky top-0 z-10 bg-slate-50">
				<tr>
					<th class="w-auto px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
					<th class="w-32 px-6 py-4 text-left text-sm font-semibold text-slate-900">Active</th>
					<th class="w-28 px-6 py-4 text-left text-sm font-semibold text-slate-900">Hours</th>
					<th class="w-28 px-6 py-4 text-left text-sm font-semibold text-slate-900">Studies</th>
					<th class="w-auto px-6 py-4 text-left text-sm font-semibold text-slate-900">Comment</th>
					{#if isEditMode}
						<th class="w-28 px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each sortedPublishers as publisher (publisher.id)}
					<tr
						class="hover:bg-slate-25 border-b border-slate-100 transition-colors"
						animate:flip={{ duration: 400 }}
						title={getTooltipContent(publisher.id)}
					>
						<td class="w-auto px-6 py-4">
							<input
								type="text"
								value={publisher.name}
								onblur={(e) => {
									const newName = (e.target as HTMLInputElement).value.trim();
									if (newName !== publisher.name && onUpdatePublisher) {
										onUpdatePublisher(publisher.id, { name: newName });
									}
								}}
								class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							/>
						</td>
						<td class="w-32 px-6 py-4">
							<div class="relative">
								<select
									value={getReportForPublisher(publisher.id)?.active === undefined
										? ''
										: getReportForPublisher(publisher.id)?.active?.toString()}
									onchange={(e) => {
										const target = e.target as HTMLSelectElement;
										const active = target.value === '' ? undefined : target.value === 'true';
										onUpdateReport(publisher.id, { active });
									}}
									class="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 pr-10 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200 appearance-none bg-white"
								>
									<option value="">-</option>
									<option value="true">Yes</option>
									<option value="false">No</option>
								</select>
								<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
									<svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
									</svg>
								</div>
							</div>
						</td>
						<td class="w-28 px-6 py-4">
							<input
								type="number"
								value={getReportForPublisher(publisher.id)?.hours ?? ''}
								oninput={(e) => {
									const target = e.target as HTMLInputElement;
									const hours = target.value === '' ? undefined : parseInt(target.value, 10);
									onUpdateReport(publisher.id, { hours });
								}}
								min="0"
								step="0.5"
								class="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							/>
						</td>
						<td class="w-28 px-6 py-4">
							<input
								type="number"
								value={getReportForPublisher(publisher.id)?.studies ?? ''}
								oninput={(e) => {
									const target = e.target as HTMLInputElement;
									const studies = target.value === '' ? undefined : parseInt(target.value, 10);
									onUpdateReport(publisher.id, { studies });
								}}
								min="0"
								step="1"
								class="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							/>
						</td>
						<td class="w-auto px-6 py-4">
							<input
								type="text"
								value={getReportForPublisher(publisher.id)?.comment || ''}
								onblur={(e) => {
									const target = e.target as HTMLInputElement;
									const comment = target.value;
									onUpdateReport(publisher.id, { comment });
								}}
								class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							/>
						</td>
						{#if isEditMode}
							<td class="w-28 px-6 py-4">
								<button
									onclick={() => onDeletePublisher && onDeletePublisher(publisher.id)}
									class="w-full rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
								>
									Delete
								</button>
							</td>
						{/if}
					</tr>
				{/each}

				{#if isEditMode}
					<TableRow isNewRow={true} {isEditMode} {onUpdateReport} {onAddPublisher} />
				{/if}
			</tbody>
		</table>
	</div>
</div>
