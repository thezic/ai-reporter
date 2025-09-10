<script lang="ts">
	interface Props {
		status: boolean | undefined;
	}

	let { status }: Props = $props();
</script>

<span
	class={[
		'rounded px-2 py-1 text-xs font-medium',
		status === true
			? 'bg-green-100 text-green-700'
			: status === false
				? 'bg-red-100 text-red-700'
				: 'bg-gray-100 text-gray-500'
	]}
>
	{status === true ? '✓Yes' : status === false ? '✗No' : '?-'}
</span>
