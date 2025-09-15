<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(),
		placeholder = '',
		disabled = false,
		required = false,
		oninput,
		onchange
	}: Props = $props();

	let showPassword = $state(false);

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		value = target.value;
		oninput?.(target.value);
	}

	function handleChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		onchange?.(target.value);
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="relative">
	<input
		type={showPassword ? 'text' : 'password'}
		{value}
		{placeholder}
		{disabled}
		{required}
		class="block w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
		oninput={handleInput}
		onchange={handleChange}
	/>
	<button
		type="button"
		class="absolute inset-y-0 right-0 flex items-center pr-3"
		onclick={togglePasswordVisibility}
		{disabled}
	>
		<svg
			class="h-5 w-5 text-slate-400 hover:text-slate-600"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			{#if showPassword}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
				/>
			{/if}
		</svg>
	</button>
</div>
