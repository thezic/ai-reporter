<script lang="ts">
	import { onMount } from 'svelte';
	import MainLayout from '$lib/components/MainLayout.svelte';
	import SettingsForm from '$lib/components/SettingsForm.svelte';
	import { AppState } from '$lib/state/AppState.svelte';

	const appState = new AppState();
	let isSaving = $state(false);

	onMount(async () => {
		await appState.init();
	});

	async function handleSaveSettings(apiKey: string, openaiEndpoint: string, language: string) {
		isSaving = true;
		try {
			appState.settings.aiApiKey = apiKey;
			appState.settings.openaiEndpoint = openaiEndpoint;
			appState.settings.language = language as import('$lib/constants/languages').SupportedLanguage;
			await appState.settings.saveSettings();
		} catch (error) {
			alert(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			isSaving = false;
		}
	}
</script>

<MainLayout>
	{#if appState.isLoading}
		<div class="flex items-center justify-center py-8">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"
			></div>
		</div>
	{:else}
		<SettingsForm
			bind:apiKey={appState.settings.aiApiKey}
			bind:openaiEndpoint={appState.settings.openaiEndpoint}
			bind:language={appState.settings.language}
			onSave={handleSaveSettings}
			{isSaving}
		/>

		{#if appState.error}
			<div
				class="fixed right-4 bottom-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-lg"
				role="alert"
			>
				<span class="block sm:inline">{appState.error}</span>
				<button
					onclick={appState.clearError}
					class="float-right pl-4 text-red-600 hover:text-red-800"
				>
					×
				</button>
			</div>
		{/if}
	{/if}
</MainLayout>
