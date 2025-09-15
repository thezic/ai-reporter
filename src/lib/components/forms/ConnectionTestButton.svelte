<script lang="ts">
	interface Props {
		status: 'idle' | 'testing' | 'success' | 'error';
		disabled?: boolean;
		onclick?: () => void;
	}

	const { status, disabled = false, onclick }: Props = $props();

	const buttonText = $derived(
		status === 'testing'
			? 'Testing...'
			: status === 'success'
				? 'Connected ✓'
				: status === 'error'
					? 'Failed ✗'
					: 'Test Connection'
	);

	function handleClick() {
		if (!disabled && status !== 'testing') {
			onclick?.();
		}
	}
</script>

<button
	type="button"
	class={{
		'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none': true,
		'cursor-not-allowed bg-slate-100 text-slate-600': status === 'testing' || disabled,
		'border border-emerald-200 bg-emerald-100 text-emerald-700': status === 'success',
		'border border-red-200 bg-red-100 text-red-700': status === 'error',
		'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': status === 'idle' && !disabled
	}}
	onclick={handleClick}
	disabled={status === 'testing' || disabled}
>
	{#if status === 'testing'}
		<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			/>
		</svg>
	{/if}
	{buttonText}
</button>
