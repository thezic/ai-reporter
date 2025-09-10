<script lang="ts">
	interface Props {
		studies: number | undefined;
	}

	let { studies }: Props = $props();
</script>

{#if studies && studies > 0}
	<span class="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
		{studies}
	</span>
{/if}
