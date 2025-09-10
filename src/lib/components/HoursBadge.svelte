<script lang="ts">
	interface Props {
		hours: number | undefined;
	}

	let { hours }: Props = $props();
</script>

<span class="text-sm font-medium text-slate-700">
	{hours ?? 0}h
</span>
