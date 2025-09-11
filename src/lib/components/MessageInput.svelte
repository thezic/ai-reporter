<script lang="ts">
	interface Props {
		value: string;
		onInput: (value: string) => void;
		isMobile?: boolean;
	}

	let { value = $bindable(), onInput, isMobile = false }: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		onInput(target.value);
	}
</script>

<div
	class={[
		'rounded-lg bg-white shadow-sm ring-1 ring-slate-200',
		isMobile ? 'flex h-full flex-col p-3' : 'flex h-full flex-col p-6'
	]}
>
	<label
		for="messages"
		class={['block text-sm font-semibold text-slate-900', isMobile ? 'mb-2' : 'mb-3']}
	>
		Messages from Publishers
	</label>
	<textarea
		id="messages"
		{value}
		oninput={handleInput}
		placeholder="Paste multiple messages from publishers here..."
		class={[
			'w-full resize-none rounded-lg border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:ring-offset-0',
			isMobile ? 'flex-1' : 'flex-1'
		]}
	></textarea>
</div>
