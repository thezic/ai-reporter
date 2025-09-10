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
	let studies = $state(report?.studies ?? undefined);
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
			studies = report?.studies ?? undefined;
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
			onUpdateReport(publisher.id, { active, hours, studies, comment });
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

	function handleStudiesChange(event: Event) {
		isUpdating = true;
		const target = event.target as HTMLInputElement;
		studies = target.value === '' ? undefined : parseInt(target.value, 10);
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

<tr class="hover:bg-slate-25 border-b border-slate-100 transition-colors">
	<td class="px-6 py-4">
		<input
			type="text"
			bind:value={name}
			onblur={handleNameBlur}
			readonly={false}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
			placeholder={isNewRow ? 'Enter publisher name...' : ''}
		/>
	</td>

	<td class="px-6 py-4">
		<select
			value={active === undefined ? '' : active.toString()}
			onchange={handleActiveChange}
			disabled={isNewRow}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
		>
			<option value="">-</option>
			<option value="true">Yes</option>
			<option value="false">No</option>
		</select>
	</td>

	<td class="px-6 py-4">
		<input
			type="number"
			value={hours ?? ''}
			oninput={handleHoursChange}
			disabled={isNewRow}
			min="0"
			step="0.5"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
		/>
	</td>

	<td class="px-6 py-4">
		<input
			type="number"
			value={studies ?? ''}
			oninput={handleStudiesChange}
			disabled={isNewRow}
			min="0"
			step="1"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
		/>
	</td>

	<td class="px-6 py-4">
		<input
			type="text"
			bind:value={comment}
			onblur={handleCommentBlur}
			disabled={isNewRow}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 transition-colors focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
		/>
	</td>

	{#if isEditMode && !isNewRow}
		<td class="px-6 py-4">
			<button
				onclick={handleDelete}
				class="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
			>
				Delete
			</button>
		</td>
	{/if}
</tr>
