<script lang="ts">
	interface Props {
		value: string;
		onInput: (value: string) => void;
	}

	let { value = $bindable(), onInput }: Props = $props();

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		onInput(target.value);
	}
</script>

<div class="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
	<label for="messages" class="mb-3 block text-sm font-semibold text-slate-900">
		Messages from Publishers
	</label>
	<textarea
		id="messages"
		{value}
		oninput={handleInput}
		placeholder="Paste multiple messages from publishers here..."
		class="resize-vertical h-40 w-full rounded-lg border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:ring-offset-0"
	></textarea>
</div>
