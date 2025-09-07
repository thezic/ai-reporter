<script lang="ts">
	import type { Publisher, Report } from '$lib/types';

	interface Props {
		publisher?: Publisher;
		report?: Report;
		isEditMode: boolean;
		isNewRow?: boolean;
		onUpdateReport: (publisherId: string, data: Partial<Report>) => void;
		onUpdatePublisher?: (publisherId: string, data: Partial<Publisher>) => void;
		onAddPublisher?: (name: string) => void;
		onDeletePublisher?: (publisherId: string) => void;
	}

	let {
		publisher,
		report,
		isEditMode,
		isNewRow = false,
		onUpdateReport,
		onUpdatePublisher,
		onAddPublisher,
		onDeletePublisher
	}: Props = $props();

	let name = $state(publisher?.name || '');
	let active = $state(report?.active ?? undefined);
	let hours = $state(report?.hours ?? undefined);
	let comment = $state(report?.comment || '');

	let isUpdating = false;

	// Update local state when props change
	$effect(() => {
		if (publisher && !isUpdating) {
			name = publisher.name || '';
		}
	});

	$effect(() => {
		if (!isUpdating) {
			active = report?.active ?? undefined;
			hours = report?.hours ?? undefined;
			comment = report?.comment || '';
		}
	});

	function handleNameBlur() {
		if (isNewRow && name.trim() && onAddPublisher) {
			onAddPublisher(name.trim());
			name = '';
		} else if (!isNewRow && publisher && onUpdatePublisher && name.trim() !== publisher.name) {
			onUpdatePublisher(publisher.id, { name: name.trim() });
		}
	}

	function handleReportUpdate() {
		if (publisher && !isNewRow) {
			onUpdateReport(publisher.id, { active, hours, comment });
		}
	}

	function handleActiveChange(event: Event) {
		isUpdating = true;
		const target = event.target as HTMLSelectElement;
		active = target.value === '' ? undefined : target.value === 'true';
		handleReportUpdate();
		setTimeout(() => {
			isUpdating = false;
		}, 0);
	}

	function handleHoursChange(event: Event) {
		isUpdating = true;
		const target = event.target as HTMLInputElement;
		hours = target.value === '' ? undefined : parseInt(target.value, 10);
		handleReportUpdate();
		setTimeout(() => {
			isUpdating = false;
		}, 0);
	}

	function handleCommentBlur() {
		isUpdating = true;
		handleReportUpdate();
		setTimeout(() => {
			isUpdating = false;
		}, 0);
	}

	function handleDelete() {
		if (publisher && onDeletePublisher) {
			onDeletePublisher(publisher.id);
		}
	}
</script>

<tr class="border-b hover:bg-gray-50">
	<td class="p-3">
		<input
			type="text"
			bind:value={name}
			onblur={handleNameBlur}
			readonly={false}
			class="w-full rounded border border-gray-300 p-2 focus:border-blue-500"
			placeholder={isNewRow ? 'Enter publisher name...' : ''}
		/>
	</td>

	<td class="p-3">
		<select
			value={active === undefined ? '' : active.toString()}
			onchange={handleActiveChange}
			disabled={isNewRow}
			class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 disabled:bg-gray-100"
		>
			<option value="">-</option>
			<option value="true">Yes</option>
			<option value="false">No</option>
		</select>
	</td>

	<td class="p-3">
		<input
			type="number"
			value={hours ?? ''}
			oninput={handleHoursChange}
			disabled={isNewRow}
			min="0"
			step="0.5"
			class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 disabled:bg-gray-100"
		/>
	</td>

	<td class="p-3">
		<input
			type="text"
			bind:value={comment}
			onblur={handleCommentBlur}
			disabled={isNewRow}
			class="w-full rounded border border-gray-300 p-2 focus:border-blue-500 disabled:bg-gray-100"
		/>
	</td>

	{#if isEditMode && !isNewRow}
		<td class="p-3">
			<button
				onclick={handleDelete}
				class="rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
			>
				Delete
			</button>
		</td>
	{/if}
</tr>
