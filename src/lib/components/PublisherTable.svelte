<script lang="ts">
	import TableRow from '$lib/components/TableRow.svelte';
	import type { Publisher, Report } from '$lib/types';

	interface Props {
		publishers: Publisher[];
		reports: Report[];
		isEditMode: boolean;
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
		onToggleEditMode,
		onUpdateReport,
		onUpdatePublisher,
		onAddPublisher,
		onDeletePublisher
	}: Props = $props();

	function getReportForPublisher(publisherId: string): Report | undefined {
		return reports.find((r) => r.publisherId === publisherId);
	}
</script>

<div class="overflow-hidden rounded-lg bg-white shadow">
	<div class="flex items-center justify-between border-b bg-gray-50 p-4">
		<h2 class="text-lg font-semibold text-gray-800">Publishers</h2>
		<button
			onclick={onToggleEditMode}
			class="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
		>
			{isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
		</button>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="p-3 text-left font-medium text-gray-700">Name</th>
					<th class="p-3 text-left font-medium text-gray-700">Active</th>
					<th class="p-3 text-left font-medium text-gray-700">Hours</th>
					<th class="p-3 text-left font-medium text-gray-700">Comment</th>
					{#if isEditMode}
						<th class="p-3 text-left font-medium text-gray-700">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each publishers as publisher (publisher.id)}
					<TableRow
						{publisher}
						report={getReportForPublisher(publisher.id)}
						{isEditMode}
						{onUpdateReport}
						{onUpdatePublisher}
						{onDeletePublisher}
					/>
				{/each}

				{#if isEditMode}
					<TableRow isNewRow={true} {isEditMode} {onUpdateReport} {onAddPublisher} />
				{/if}
			</tbody>
		</table>
	</div>
</div>
