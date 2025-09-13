<script lang="ts">
	import { getProviderById } from '$lib/constants/aiProviders';
	import FormField from './forms/FormField.svelte';
	import ConnectionTestButton from './forms/ConnectionTestButton.svelte';
	import OpenAIConfig from './providers/OpenAIConfig.svelte';
	import AnthropicConfig from './providers/AnthropicConfig.svelte';
	import GitHubConfig from './providers/GitHubConfig.svelte';
	import type { AIProviderConfig } from '$lib/types';

	interface Props {
		provider: string;
		config: AIProviderConfig;
		onConfigUpdate: (updates: Partial<AIProviderConfig>) => void;
		onTestConnection: () => void;
		connectionStatus: 'idle' | 'testing' | 'success' | 'error';
		connectionError: string;
	}

	const {
		provider,
		config,
		onConfigUpdate,
		onTestConnection,
		connectionStatus,
		connectionError
	}: Props = $props();

	const providerInfo = $derived(getProviderById(provider));
</script>

{#if providerInfo}
	<div class="space-y-6" style="transition: height 300ms ease-in-out;">
		<!-- Provider-specific Configuration -->
		{#if provider === 'openai'}
			<OpenAIConfig {providerInfo} {config} {onConfigUpdate} />
		{:else if provider === 'anthropic'}
			<AnthropicConfig {providerInfo} {config} {onConfigUpdate} />
		{:else if provider === 'github'}
			<GitHubConfig {providerInfo} {config} {onConfigUpdate} />
		{/if}

		<!-- Connection Test -->
		<FormField label="Connection Test">
			<div class="flex items-center gap-4">
				<ConnectionTestButton
					status={connectionStatus}
					disabled={!config.apiKey}
					onclick={onTestConnection}
				/>

				<!-- Connection Status Display -->
				{#if connectionStatus === 'success'}
					<div class="flex items-center text-sm text-emerald-600">
						<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Connection successful
					</div>
				{:else if connectionStatus === 'error' && connectionError}
					<div class="flex items-start text-sm text-red-600">
						<svg
							class="mt-0.5 mr-1 h-4 w-4 flex-shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
						<div class="flex-1">
							<div class="font-medium">Connection failed</div>
							<div class="mt-1 text-xs text-red-500">{connectionError}</div>
						</div>
					</div>
				{/if}
			</div>
		</FormField>
	</div>
{/if}
