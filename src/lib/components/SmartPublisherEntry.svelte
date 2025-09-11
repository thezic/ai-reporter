<script lang="ts">
	import type { Publisher } from '$lib/types';

	interface Props {
		publishers: Publisher[];
		onAddPublisher: (name: string) => Promise<void>;
		onAddPublishers: (names: string[]) => Promise<void>;
	}

	let { publishers, onAddPublisher, onAddPublishers }: Props = $props();

	let inputValue = $state('');
	let mode = $state<'collapsed' | 'single' | 'bulk-detect' | 'bulk-preview'>('collapsed');
	let validatedNames = $state<{ name: string; isDuplicate: boolean }[]>([]);
	let isProcessing = $state(false);
	let textareaElement = $state<HTMLTextAreaElement | undefined>(undefined);

	function isDuplicate(newName: string, existingPublishers: Publisher[]): boolean {
		const normalized = newName.trim().toLowerCase();
		return existingPublishers.some((p) => p.name.trim().toLowerCase() === normalized);
	}

	function validateNames(names: string[], existingPublishers: Publisher[]) {
		return names
			.map((name) => ({
				name: name.trim(),
				isDuplicate: isDuplicate(name, existingPublishers)
			}))
			.filter((item) => item.name.length > 0);
	}

	function detectBulkInput(text: string): boolean {
		return text.includes('\n') || text.includes(';') || text.includes('|');
	}

	function parseNames(text: string): string[] {
		return text
			.split(/[\n;|]/)
			.map((name) => name.trim().replace(/\s+/g, ' '))
			.filter((name) => name.length > 0);
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		inputValue = target.value;

		if (inputValue.trim() === '') {
			mode = 'collapsed';
			validatedNames = [];
			return;
		}

		if (detectBulkInput(inputValue)) {
			mode = 'bulk-detect';
			processNames();
		} else {
			mode = 'single';
		}
	}

	function handleFocus() {
		if (mode === 'collapsed' && inputValue.trim() === '') {
			mode = 'single';
		}
	}

	function handleBlur(event: FocusEvent) {
		const relatedTarget = event.relatedTarget as HTMLElement;
		if (!relatedTarget || !relatedTarget.closest('.smart-publisher-entry')) {
			if (inputValue.trim() === '') {
				mode = 'collapsed';
			}
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (mode === 'single' && !event.shiftKey) {
				// In single mode, Enter submits (unless Shift+Enter for new line)
				event.preventDefault();
				handleSingleAdd();
			} else if (mode === 'bulk-preview' && !event.shiftKey) {
				// In bulk preview, Enter confirms (unless Shift+Enter for new line)
				event.preventDefault();
				handleBulkAdd();
			}
			// In collapsed or bulk-detect mode, Enter creates new lines as normal
		} else if (event.key === 'Escape') {
			handleCancel();
		}
	}

	async function processNames() {
		isProcessing = true;

		// Debounce processing
		await new Promise((resolve) => setTimeout(resolve, 300));

		if (mode !== 'bulk-detect') {
			isProcessing = false;
			return;
		}

		const names = parseNames(inputValue);
		validatedNames = validateNames(names, publishers);
		mode = 'bulk-preview';
		isProcessing = false;
	}

	async function handleSingleAdd() {
		if (!inputValue.trim()) return;

		const name = inputValue.trim();
		if (isDuplicate(name, publishers)) {
			// For now, show alert - later can be enhanced with modal
			alert(`Publisher "${name}" already exists!`);
			return;
		}

		try {
			await onAddPublisher(name);
			inputValue = '';
			mode = 'collapsed';
			// Reset textarea height
			if (textareaElement) {
				textareaElement.style.height = '48px';
			}
		} catch (error) {
			console.error('Failed to add publisher:', error);
		}
	}

	async function handleBulkAdd() {
		const validNames = validatedNames.filter((item) => !item.isDuplicate).map((item) => item.name);

		if (validNames.length === 0) {
			alert('No valid names to add!');
			return;
		}

		try {
			await onAddPublishers(validNames);
			inputValue = '';
			validatedNames = [];
			mode = 'collapsed';
			// Reset textarea height
			if (textareaElement) {
				textareaElement.style.height = '48px';
			}
		} catch (error) {
			console.error('Failed to add publishers:', error);
		}
	}

	function handleCancel() {
		inputValue = '';
		validatedNames = [];
		mode = 'collapsed';
		// Reset textarea height
		if (textareaElement) {
			textareaElement.style.height = '48px';
		}
	}

	function handleEdit() {
		mode = 'bulk-detect';
		setTimeout(() => {
			if (textareaElement) {
				textareaElement.focus();
			}
		}, 0);
	}

	function autoResize() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = `${Math.max(48, textareaElement.scrollHeight)}px`;
		}
	}

	// Auto-resize when content changes
	$effect(() => {
		if (inputValue) {
			setTimeout(autoResize, 0);
		}
	});

	const validCount = $derived(validatedNames.filter((item) => !item.isDuplicate).length);
	const duplicateCount = $derived(validatedNames.filter((item) => item.isDuplicate).length);
</script>

<div class="smart-publisher-entry w-full">
	<!-- Always visible textarea with dynamic button based on mode -->
	<div class="flex items-center gap-3">
		<div class="relative flex-1">
			<textarea
				bind:this={textareaElement}
				bind:value={inputValue}
				oninput={(e) => {
					handleInput(e);
					autoResize();
				}}
				onfocus={handleFocus}
				onblur={handleBlur}
				onkeydown={handleKeyDown}
				rows="1"
				class="w-full resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
				style="min-height: 48px;"
				placeholder={mode === 'bulk-detect' || mode === 'bulk-preview' 
					? 'Enter publisher names (one per line, or separated by semicolons)...'
					: mode === 'collapsed' 
						? '👤 Add publisher name...' 
						: '👤 Enter publisher name...'}
			></textarea>
		</div>
		
		<!-- Dynamic button based on mode -->
		{#if mode === 'collapsed'}
			<button
				onclick={() => {
					mode = 'single';
					if (textareaElement) textareaElement.focus();
				}}
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700 text-white transition-colors hover:bg-slate-800"
				aria-label="Add publisher"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
			</button>
		{:else if mode === 'single'}
			<button
				onclick={handleSingleAdd}
				disabled={!inputValue.trim()}
				class="self-start rounded-lg bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500"
			>
				Add
			</button>
		{/if}
	</div>

	<!-- Additional UI for bulk modes (shown below the main textarea) -->
	{#if mode === 'bulk-detect' && isProcessing}
		<div class="mt-4 flex items-center gap-2 text-slate-600">
			<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"
				></circle>
				<path
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					class="opacity-75"
				></path>
			</svg>
			🔍 Processing names...
		</div>
	{/if}

	{#if mode === 'bulk-preview'}
		<div class="mt-4 space-y-3">
			<div class="text-sm font-medium text-slate-700">
				📋 Preview: {validatedNames.length} names detected
			</div>

			<div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
				<div class="grid gap-2 sm:grid-cols-2">
					{#each validatedNames as item (item.name)}
						<div class="flex items-center gap-2">
							{#if item.isDuplicate}
								<span class="text-amber-600">🔄</span>
								<span class="text-sm text-amber-700">{item.name} (duplicate)</span>
							{:else}
								<span class="text-emerald-600">✅</span>
								<span class="text-sm text-slate-900">{item.name}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="flex flex-wrap gap-3">
				<button
					onclick={handleEdit}
					class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					📝 Edit
				</button>

				{#if validCount > 0}
					<button
						onclick={handleBulkAdd}
						class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
					>
						➕ Add Valid ({validCount})
					</button>
				{/if}

				<button
					onclick={handleCancel}
					class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				>
					✖ Cancel
				</button>
			</div>

			{#if duplicateCount > 0}
				<div class="text-xs text-amber-600">
					{duplicateCount} duplicate{duplicateCount === 1 ? '' : 's'} will be skipped
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.smart-publisher-entry {
		transition: all 300ms ease-out;
	}
</style>
