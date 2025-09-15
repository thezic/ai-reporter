<script lang="ts">
	import FormField from '../forms/FormField.svelte';
	import PasswordInput from '../forms/PasswordInput.svelte';
	import SelectInput from '../forms/SelectInput.svelte';
	import type { AIProviderConfig, AIProviderInfo } from '$lib/types';

	interface Props {
		providerInfo: AIProviderInfo;
		config: AIProviderConfig;
		onConfigUpdate: (updates: Partial<AIProviderConfig>) => void;
		apiKeyLabel?: string;
		apiKeyPlaceholder?: string;
	}

	const {
		providerInfo,
		config,
		onConfigUpdate,
		apiKeyLabel = 'API Key',
		apiKeyPlaceholder = 'Enter your API key'
	}: Props = $props();

	function updateField(field: keyof AIProviderConfig, value: string) {
		onConfigUpdate({ [field]: value });
	}
</script>

<!-- API Key Field -->
<FormField label={apiKeyLabel} required>
	<PasswordInput
		value={config.apiKey}
		placeholder={apiKeyPlaceholder}
		oninput={(value) => updateField('apiKey', value)}
		required
	/>
</FormField>

<!-- Model Selection -->
{#if providerInfo.models.length > 0}
	<FormField label="Model" required>
		<SelectInput
			value={config.model}
			options={providerInfo.models}
			onchange={(value) => updateField('model', value)}
			required
		/>
	</FormField>
{/if}
