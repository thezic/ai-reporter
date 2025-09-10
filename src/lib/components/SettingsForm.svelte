<script lang="ts">
	interface Props {
		apiKey: string;
		openaiEndpoint: string;
		onSave: (apiKey: string, openaiEndpoint: string) => void;
		isSaving?: boolean;
	}

	let { apiKey = $bindable(), openaiEndpoint = $bindable(), onSave, isSaving = false }: Props = $props();

	// eslint-disable-next-line svelte/prefer-writable-derived
	let localApiKey = $state(apiKey);
	let localOpenaiEndpoint = $state(openaiEndpoint);

	function handleSave(event: SubmitEvent) {
		event.preventDefault();
		onSave(localApiKey, localOpenaiEndpoint);
	}

	function handleApiKeyInput(event: Event) {
		const target = event.target as HTMLInputElement;
		localApiKey = target.value;
	}

	function handleEndpointInput(event: Event) {
		const target = event.target as HTMLInputElement;
		localOpenaiEndpoint = target.value;
	}

	$effect(() => {
		localApiKey = apiKey;
		localOpenaiEndpoint = openaiEndpoint;
	});
</script>

<div class="mx-auto max-w-md rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200">
	<h2 class="mb-6 text-xl font-semibold text-slate-900">Settings</h2>

	<form onsubmit={handleSave} class="space-y-6">
		<div>
			<label for="apiKey" class="mb-3 block text-sm font-semibold text-slate-900">
				AI Service API Key
			</label>
			<input
				id="apiKey"
				type="password"
				value={localApiKey}
				oninput={handleApiKeyInput}
				placeholder="Enter your AI API key..."
				class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:ring-offset-0"
			/>
		</div>

		<div>
			<label for="openaiEndpoint" class="mb-3 block text-sm font-semibold text-slate-900">
				OpenAI Endpoint
			</label>
			<input
				id="openaiEndpoint"
				type="url"
				value={localOpenaiEndpoint}
				oninput={handleEndpointInput}
				placeholder="https://models.github.ai/inference"
				class="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:ring-offset-0"
			/>
		</div>

		<button
			type="submit"
			disabled={isSaving}
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500"
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
