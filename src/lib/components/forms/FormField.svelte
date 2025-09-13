<script lang="ts">
	interface Props {
		label: string;
		description?: string;
		required?: boolean;
		error?: string;
		for?: string;
		children: import('svelte').Snippet;
	}

	const { label, description, required = false, error, for: forId, children }: Props = $props();
</script>

<div>
	<label for={forId} class="block text-sm font-semibold text-slate-900">
		{label}
		{#if required}
			<span class="text-red-500">*</span>
		{/if}
	</label>
	{#if description}
		<p class="mt-1 text-sm text-slate-600">{description}</p>
	{/if}
	<div class="mt-1">
		{@render children()}
	</div>
	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
