<script lang="ts">
	interface Props {
		apiKey: string;
		onSave: (apiKey: string) => void;
		isSaving?: boolean;
	}

	let { apiKey = $bindable(), onSave, isSaving = false }: Props = $props();

	// eslint-disable-next-line svelte/prefer-writable-derived
	let localApiKey = $state(apiKey);

	function handleSave(event: SubmitEvent) {
		event.preventDefault();
		onSave(localApiKey);
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		localApiKey = target.value;
	}

	$effect(() => {
		localApiKey = apiKey;
	});
</script>

<div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
	<h2 class="mb-6 text-xl font-semibold text-gray-800">Settings</h2>

	<form onsubmit={handleSave} class="space-y-4">
		<div>
			<label for="apiKey" class="mb-2 block text-sm font-medium text-gray-700">
				AI Service API Key
			</label>
			<input
				id="apiKey"
				type="password"
				value={localApiKey}
				oninput={handleInput}
				placeholder="Enter your AI API key..."
				class="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<button
			type="submit"
			disabled={isSaving}
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
		>
			{#if isSaving}
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></div>
			{/if}
			Save Settings
		</button>
	</form>
</div>
