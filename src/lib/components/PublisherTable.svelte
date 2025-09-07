<script lang="ts">
	import TableRow from '$lib/components/TableRow.svelte';
	import type { Publisher, Report } from '$lib/types';
	import { flip } from 'svelte/animate';

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
				{#each sortedPublishers as publisher (publisher.id)}
					<tr class="border-b hover:bg-gray-50" animate:flip={{ duration: 400 }}>
						<td class="p-3">
							<input
								type="text"
								value={publisher.name}
								onblur={(e) => {
									const newName = (e.target as HTMLInputElement).value.trim();
									if (newName !== publisher.name && onUpdatePublisher) {
										onUpdatePublisher(publisher.id, { name: newName });
									}
								}}
								class="w-full rounded border border-gray-300 p-2 focus:border-blue-500"
							/>
						</td>
						<td class="p-3">
							<select
								value={getReportForPublisher(publisher.id)?.active === undefined
									? ''
									: getReportForPublisher(publisher.id)?.active?.toString()}
								onchange={(e) => {
									const target = e.target as HTMLSelectElement;
									const active = target.value === '' ? undefined : target.value === 'true';
									onUpdateReport(publisher.id, { active });
								}}
								class="w-full rounded border border-gray-300 p-2 focus:border-blue-500"
							>
								<option value="">-</option>
								<option value="true">Yes</option>
								<option value="false">No</option>
							</select>
						</td>
						<td class="p-3">
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
								class="w-full rounded border border-gray-300 p-2 focus:border-blue-500"
							/>
						</td>
						<td class="p-3">
							<input
								type="text"
								value={getReportForPublisher(publisher.id)?.comment || ''}
								onblur={(e) => {
									const target = e.target as HTMLInputElement;
									const comment = target.value;
									onUpdateReport(publisher.id, { comment });
								}}
								class="w-full rounded border border-gray-300 p-2 focus:border-blue-500"
							/>
						</td>
						{#if isEditMode}
							<td class="p-3">
								<button
									onclick={() => onDeletePublisher && onDeletePublisher(publisher.id)}
									class="rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
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
