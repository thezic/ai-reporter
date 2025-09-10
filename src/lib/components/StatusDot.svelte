<script lang="ts">
	interface Props {
		status: boolean | undefined;
	}

	let { status }: Props = $props();
	
	const ariaLabel = $derived(() => {
		if (status === true) return 'Active';
		if (status === false) return 'Inactive';
		return 'Status unknown';
	});
</script>

<span 
	class={[
		'inline-block h-2.5 w-2.5 rounded-full',
		status === true ? 'bg-emerald-500' : 
		status === false ? 'bg-red-500' : 'bg-slate-400'
	]}
	aria-label={ariaLabel}
	title={ariaLabel}
></span>