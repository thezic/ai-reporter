<script lang="ts">
	import FormField from '../forms/FormField.svelte';
	import TextInput from '../forms/TextInput.svelte';
	import BaseProviderConfig from './BaseProviderConfig.svelte';
	import type { AIProviderConfig, AIProviderInfo } from '$lib/types';

	interface Props {
		providerInfo: AIProviderInfo;
		config: AIProviderConfig;
		onConfigUpdate: (updates: Partial<AIProviderConfig>) => void;
	}

	const { providerInfo, config, onConfigUpdate }: Props = $props();

	function updateField(field: keyof AIProviderConfig, value: string) {
		onConfigUpdate({ [field]: value });
	}
</script>

<!-- Base configuration (API Key + Model) -->
<BaseProviderConfig {providerInfo} {config} {onConfigUpdate} />

<!-- OpenAI-specific: Custom Endpoint -->
<FormField label="Endpoint" description="Custom endpoint (optional)">
	<TextInput
		value={config.endpoint || ''}
		type="url"
		placeholder={providerInfo.defaultEndpoint}
		oninput={(value) => updateField('endpoint', value)}
	/>
</FormField>
