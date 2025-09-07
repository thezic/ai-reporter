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

<div class="mb-6">
	<label for="messages" class="mb-2 block text-sm font-medium text-gray-700">
		Messages from Publishers
	</label>
	<textarea
		id="messages"
		{value}
		oninput={handleInput}
		placeholder="Paste multiple messages from publishers here..."
		class="resize-vertical h-32 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
	></textarea>
</div>
