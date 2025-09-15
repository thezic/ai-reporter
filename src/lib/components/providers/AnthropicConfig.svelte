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

<!-- Anthropic only needs base configuration (API Key + Model) -->
<BaseProviderConfig {providerInfo} {config} {onConfigUpdate} />
