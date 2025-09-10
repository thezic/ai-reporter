<script lang="ts">
	interface Props {
		hours: number | undefined;
	}

	let { hours }: Props = $props();
</script>

{#if hours && hours > 0}
	<span class="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
		{hours}h
	</span>
{/if}
