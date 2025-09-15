<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		type?: 'text' | 'email' | 'url';
		disabled?: boolean;
		required?: boolean;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(),
		placeholder = '',
		type = 'text',
		disabled = false,
		required = false,
		oninput,
		onchange
	}: Props = $props();

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		value = target.value;
		oninput?.(target.value);
	}

	function handleChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		onchange?.(target.value);
	}
</script>

<input
	{type}
	{value}
	{placeholder}
	{disabled}
	{required}
	class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
	oninput={handleInput}
	onchange={handleChange}
/>
