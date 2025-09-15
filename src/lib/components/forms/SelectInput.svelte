<script lang="ts">
	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		value: string;
		options: Option[] | string[];
		disabled?: boolean;
		required?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(),
		options,
		disabled = false,
		required = false,
		onchange
	}: Props = $props();

	// Normalize options to Option[] format
	const normalizedOptions = $derived(
		options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
	);

	function handleChange(event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		value = target.value;
		onchange?.(target.value);
	}
</script>

<select
	{value}
	{disabled}
	{required}
	class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
	onchange={handleChange}
>
	{#each normalizedOptions as option (option.value)}
		<option value={option.value} disabled={option.disabled}>
			{option.label}
		</option>
	{/each}
</select>
