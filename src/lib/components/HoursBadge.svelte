<script lang="ts">
	interface Props {
		hours: number | undefined;
	}

	let { hours }: Props = $props();
</script>

{#if hours && hours > 0}
	<span class="text-sm font-medium text-slate-700">
		{hours}h
	</span>
{/if}
