<script lang="ts">
	import BaseProviderConfig from './BaseProviderConfig.svelte';
	import type { AIProviderConfig, AIProviderInfo } from '$lib/types';

	interface Props {
		providerInfo: AIProviderInfo;
		config: AIProviderConfig;
		onConfigUpdate: (updates: Partial<AIProviderConfig>) => void;
	}

	const { providerInfo, config, onConfigUpdate }: Props = $props();
</script>

<!-- GitHub Models uses Personal Access Token instead of API Key -->
<BaseProviderConfig
	{providerInfo}
	{config}
	{onConfigUpdate}
	apiKeyLabel="Personal Access Token"
	apiKeyPlaceholder="Enter your Personal Access Token"
/>
