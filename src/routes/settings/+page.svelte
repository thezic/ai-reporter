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

	async function handleSaveSettings(apiKey: string) {
		isSaving = true;
		try {
			appState.settings.aiApiKey = apiKey;
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
				class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
			></div>
		</div>
	{:else}
		<SettingsForm bind:apiKey={appState.settings.aiApiKey} onSave={handleSaveSettings} {isSaving} />

		{#if appState.error}
			<div
				class="fixed right-4 bottom-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
				role="alert"
			>
				<span class="block sm:inline">{appState.error}</span>
				<button
					onclick={appState.clearError}
					class="float-right pl-4 text-red-500 hover:text-red-700"
				>
					×
				</button>
			</div>
		{/if}
	{/if}
</MainLayout>
