<script lang="ts">
	import StatusDot from '$lib/components/StatusDot.svelte';
	import HoursBadge from '$lib/components/HoursBadge.svelte';
	import StudiesBadge from '$lib/components/StudiesBadge.svelte';
	import type { Publisher, Report } from '$lib/types';
	import type { ReportMetadata } from '$lib/services/AIService';

	interface Props {
		publisher: Publisher;
		report: Report | undefined;
		metadata: ReportMetadata | undefined;
		isEditMode: boolean;
		isExpanded: boolean;
		onToggleExpansion: (publisherId: string) => void;
		onUpdateReport: (publisherId: string, data: Partial<Report>) => void;
		onUpdatePublisher: (publisherId: string, data: Partial<Publisher>) => void;
		onDeletePublisher: (publisherId: string) => void;
		isLast?: boolean;
	}

	let {
		publisher,
		report,
		metadata,
		isEditMode,
		isExpanded,
		onToggleExpansion,
		onUpdateReport,
		onUpdatePublisher,
		onDeletePublisher,
		isLast = false
	}: Props = $props();

	const isEmpty = $derived(report?.active == undefined);

	function handleNameUpdate(event: Event) {
		const target = event.target as HTMLInputElement;
		const newName = target.value.trim();
		if (newName !== publisher.name) {
			onUpdatePublisher(publisher.id, { name: newName });
		}
	}

	function handleStatusChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const active = target.value === '' ? undefined : target.value === 'true';
		onUpdateReport(publisher.id, { active });
	}

	function handleHoursChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const hours = target.value === '' ? undefined : parseInt(target.value, 10);
		onUpdateReport(publisher.id, { hours });
	}

	function handleStudiesChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const studies = target.value === '' ? undefined : parseInt(target.value, 10);
		onUpdateReport(publisher.id, { studies });
	}

	function handleCommentUpdate(event: Event) {
		const target = event.target as HTMLInputElement;
		const comment = target.value;
		onUpdateReport(publisher.id, { comment });
	}
</script>

<div
	class={[
		isLast ? '' : 'border-b border-slate-200',
		isEmpty ? 'bg-slate-25' : '',
		'border-l-2',
		isEmpty ? 'border-l-orange-300' : 'border-l-transparent'
	]}
>
	<!-- Card Header (Always Visible) -->
	<div
		class={[
			'w-full cursor-pointer px-4 py-3 transition-colors',
			isEmpty ? 'hover:bg-slate-50' : 'hover:bg-slate-50'
		]}
		onclick={() => {
			onToggleExpansion(publisher.id);
		}}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && onToggleExpansion(publisher.id)}
	>
		<!-- Line 1: Core Data -->
		<div class="mb-1 flex items-center gap-3">
			<div class="flex min-w-0 flex-1 items-center gap-2">
				<StatusDot status={report?.active} />
				<span class={['truncate font-medium', isEmpty ? 'text-slate-600' : 'text-slate-900']}>
					{publisher.name}
				</span>
			</div>
			<div class="flex items-center gap-2">
				<HoursBadge hours={report?.hours} />
				<StudiesBadge studies={report?.studies} />
			</div>
			<svg
				class={[
					'h-4 w-4 flex-shrink-0 text-slate-400 transition-transform',
					isExpanded ? 'rotate-90' : 'rotate-0'
				]}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</div>

		<!-- Line 2: Comment -->
		<div class="truncate text-sm text-slate-600">
			{report?.comment || '\u00A0'}
		</div>
	</div>

	<!-- Expanded Content -->
	{#if isExpanded}
		<div class="space-y-3 border-t border-slate-100 px-4 py-3">
			<!-- Editable Fields -->
			<div class="space-y-3">
				<!-- Name Field -->
				<div>
					<label for={`name-${publisher.id}`} class="mb-1 block text-xs font-medium text-slate-700"
						>Name</label
					>
					<input
						id={`name-${publisher.id}`}
						type="text"
						value={publisher.name}
						onblur={handleNameUpdate}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
					/>
				</div>

				<!-- Active Field -->
				<div>
					<label
						for={`active-${publisher.id}`}
						class="mb-1 block text-xs font-medium text-slate-700">Active</label
					>
					<select
						id={`active-${publisher.id}`}
						value={report?.active === undefined ? '' : report.active.toString()}
						onchange={handleStatusChange}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
					>
						<option value="">-</option>
						<option value="true">Yes</option>
						<option value="false">No</option>
					</select>
				</div>

				<!-- Hours and Studies (Side by Side) -->
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label
							for={`hours-${publisher.id}`}
							class="mb-1 block text-xs font-medium text-slate-700">Hours</label
						>
						<input
							id={`hours-${publisher.id}`}
							type="number"
							value={report?.hours ?? ''}
							oninput={handleHoursChange}
							min="0"
							step="0.5"
							class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
						/>
					</div>
					<div>
						<label
							for={`studies-${publisher.id}`}
							class="mb-1 block text-xs font-medium text-slate-700">Studies</label
						>
						<input
							id={`studies-${publisher.id}`}
							type="number"
							value={report?.studies ?? ''}
							oninput={handleStudiesChange}
							min="0"
							step="1"
							class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
						/>
					</div>
				</div>

				<!-- Comment Field -->
				<div>
					<label
						for={`comment-${publisher.id}`}
						class="mb-1 block text-xs font-medium text-slate-700">Comment</label
					>
					<input
						id={`comment-${publisher.id}`}
						type="text"
						value={report?.comment || ''}
						onblur={handleCommentUpdate}
						class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
					/>
				</div>
			</div>

			<!-- AI Reasoning Section -->
			{#if metadata}
				<div class="space-y-2 border-t border-slate-100 pt-3">
					<div class="flex items-center gap-2">
						<span class="text-lg">💡</span>
						<span class="text-sm font-medium text-slate-700">
							{metadata.matchConfidence} confidence
						</span>
					</div>
					{#if metadata.originalText}
						<div class="text-sm">
							<span class="font-medium text-slate-500">Original:</span>
							<span class="text-slate-700">"{metadata.originalText}"</span>
						</div>
					{/if}
					{#if metadata.reasoning}
						<div class="text-sm">
							<span class="font-medium text-slate-500">Reasoning:</span>
							<span class="text-slate-700">{metadata.reasoning}</span>
						</div>
					{/if}
					<div class="text-sm">
						<span class="font-medium text-slate-500">Reported by:</span>
						<span class="text-slate-700">{metadata.reportedBy}</span>
					</div>
				</div>
			{:else}
				<div class="space-y-2 border-t border-slate-100 pt-3">
					<div class="text-sm text-slate-500">
						No AI reasoning data available for this publisher.
					</div>
				</div>
			{/if}

			<!-- Delete Button (Edit Mode Only) -->
			{#if isEditMode}
				<div class="border-t border-slate-100 pt-3">
					<button
						onclick={() => onDeletePublisher(publisher.id)}
						class="w-full rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
					>
						Delete Publisher
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
