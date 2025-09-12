<script lang="ts">
	import { SUPPORTED_LANGUAGES } from '$lib/constants/languages';
	import ProviderSelectionCards from '$lib/components/ProviderSelectionCards.svelte';
	import ProviderConfigPanel from '$lib/components/ProviderConfigPanel.svelte';
	import type { AIProviderConfig } from '$lib/types';
	import type { SupportedLanguage } from '$lib/constants/languages';

	interface Props {
		aiProvider: AIProviderConfig;
		language: SupportedLanguage;
		connectionStatus: 'idle' | 'testing' | 'success' | 'error';
		connectionError: string;
		onProviderSelect: (providerId: string) => void;
		onConfigUpdate: (updates: Partial<AIProviderConfig>) => void;
		onTestConnection: () => void;
		onSave: () => void;
		onLanguageChange: (language: SupportedLanguage) => void;
		isSaving?: boolean;
	}

	const {
		aiProvider,
		language,
		connectionStatus,
		connectionError,
		onProviderSelect,
		onConfigUpdate,
		onTestConnection,
		onSave,
		onLanguageChange,
		isSaving = false
	}: Props = $props();

	function handleSave(event: SubmitEvent) {
		event.preventDefault();
		onSave();
	}

	function handleLanguageChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		onLanguageChange(target.value as SupportedLanguage);
	}
</script>

<div class="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200">
	<h2 class="mb-6 text-xl font-semibold text-slate-900">Settings</h2>

	<form onsubmit={handleSave} class="space-y-8">
		<!-- Provider Selection -->
		<ProviderSelectionCards
			selectedProvider={aiProvider.provider}
			onProviderSelect={onProviderSelect}
		/>

		<!-- Provider Configuration -->
		<ProviderConfigPanel
			provider={aiProvider.provider}
			config={aiProvider}
			onConfigUpdate={onConfigUpdate}
			onTestConnection={onTestConnection}
			connectionStatus={connectionStatus}
			connectionError={connectionError}
		/>

		<!-- Language Selection -->
		<div>
			<label for="language" class="block text-sm font-semibold text-slate-900">
				Output Language
			</label>
			<p class="text-sm text-slate-600">Language for AI responses and generated content</p>
			<select
				id="language"
				value={language}
				onchange={handleLanguageChange}
				class="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
			>
				{#each Object.entries(SUPPORTED_LANGUAGES) as [code, label] (code)}
					<option value={code}>{label}</option>
				{/each}
			</select>
		</div>

		<!-- Save Button -->
		<div class="border-t pt-6">
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
		</div>
	</form>
</div>
