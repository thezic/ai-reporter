<script lang="ts">
	import { onMount } from 'svelte';
	import ActionButtons from './ActionButtons.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		messages: string;
		onMessagesInput: (value: string) => void;
		onParse: () => void;
		onExportCsv: () => void;
		onExportExcel: () => void;
		onClearReports: () => void;
		isLoading?: boolean;
		canParse?: boolean;
	}

	let {
		isOpen,
		onClose,
		messages = $bindable(),
		onMessagesInput,
		onParse,
		onExportCsv,
		onExportExcel,
		onClearReports,
		isLoading = false,
		canParse = true
	}: Props = $props();

	let panelElement: HTMLDivElement;
	let inputElement: HTMLElement;

	// Handle keyboard events
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}

	// Auto-focus input when panel opens
	$effect(() => {
		if (isOpen) {
			// Focus after animation starts
			setTimeout(() => {
				const textArea = panelElement?.querySelector('textarea');
				textArea?.focus();
			}, 100);
		}
	});

	// Add/remove event listeners
	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	// Handle backdrop keyboard events
	function handleBackdropKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onClose();
		}
	}

	// Handle successful parse - auto close panel
	async function handleParse() {
		await onParse();
		// Auto-close after successful parse
		onClose();
	}
</script>

<!-- Backdrop -->
{#if isOpen}
	<div
		class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
		onclick={handleBackdropClick}
		onkeydown={handleBackdropKeydown}
		role="button"
		tabindex="-1"
		aria-label="Close panel"
	></div>
{/if}

<!-- Slide-in Panel -->
<div
	bind:this={panelElement}
	class={[
		'fixed right-0 bottom-0 left-0 z-50 flex flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden',
		isOpen ? 'translate-y-0' : 'translate-y-full'
	]}
	style="height: 70vh; max-height: 600px; padding-bottom: env(safe-area-inset-bottom, 0px);"
>
	<!-- Panel Header -->
	<div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
		<h2 class="text-lg font-semibold text-slate-900">Messages</h2>
		<button
			onclick={onClose}
			class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
			aria-label="Close panel"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>

	<!-- Panel Content -->
	<div class="flex flex-1 flex-col gap-4 p-4">
		<!-- Label -->
		<label for="messages-mobile" class="block text-sm font-semibold text-slate-900">
			Messages from Publishers
		</label>

		<!-- Message Input - Flexible Height -->
		<div class="min-h-0 flex-1">
			<textarea
				id="messages-mobile"
				bind:value={messages}
				oninput={(e) => onMessagesInput(e.target.value)}
				placeholder="Paste multiple messages from publishers here..."
				class="w-full h-full resize-none rounded-lg bg-slate-50 p-4 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200 focus:ring-offset-0 border border-slate-300"
			></textarea>
		</div>

		<!-- Action Buttons - Fixed Height -->
		<div class="flex-shrink-0">
			<ActionButtons
				onParse={handleParse}
				{onExportCsv}
				{onExportExcel}
				{onClearReports}
				{isLoading}
				{canParse}
				isMobile={true}
			/>
		</div>
	</div>
</div>
