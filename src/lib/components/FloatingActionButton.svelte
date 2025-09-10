<script lang="ts">
	interface Props {
		onClick: () => void;
		hasContent?: boolean;
	}

	let { onClick, hasContent = false }: Props = $props();
</script>

<button
	onclick={onClick}
	class="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all hover:scale-105 hover:bg-emerald-700 active:scale-95 lg:hidden"
	aria-label="Open message input panel"
>
	<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 6v6m0 0v6m0-6h6m-6 0H6"
		/>
	</svg>

	{#if hasContent}
		<div
			class="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-red-500"
		></div>
	{/if}
</button>
