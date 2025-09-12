<script lang="ts">
	import { getProviderById } from '$lib/constants/aiProviders';
	import type { AIProviderConfig } from '$lib/types';

	interface Props {
		provider: string;
		config: AIProviderConfig;
		onConfigUpdate: (updates: Partial<AIProviderConfig>) => void;
		onTestConnection: () => void;
		connectionStatus: 'idle' | 'testing' | 'success' | 'error';
		connectionError: string;
	}

	const { provider, config, onConfigUpdate, onTestConnection, connectionStatus, connectionError }: Props = $props();

	const providerInfo = $derived(getProviderById(provider));
	const showPassword = $state<Record<string, boolean>>({});

	function togglePasswordVisibility(field: string) {
		showPassword[field] = !showPassword[field];
	}

	function handleInputChange(field: keyof AIProviderConfig, value: string) {
		onConfigUpdate({ [field]: value });
	}

	function getTestButtonText() {
		switch (connectionStatus) {
			case 'testing':
				return 'Testing...';
			case 'success':
				return 'Connected ✓';
			case 'error':
				return 'Failed ✗';
			default:
				return 'Test Connection';
		}
	}

	function getTestButtonClass() {
		const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
		
		switch (connectionStatus) {
			case 'testing':
				return `${base} bg-slate-100 text-slate-600 cursor-not-allowed`;
			case 'success':
				return `${base} bg-emerald-100 text-emerald-700 border border-emerald-200`;
			case 'error':
				return `${base} bg-red-100 text-red-700 border border-red-200`;
			default:
				return `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
		}
	}
</script>

{#if providerInfo}
	<div class="space-y-6" style="transition: height 300ms ease-in-out;">
		<!-- API Key Field -->
		<div>
			<label for="apiKey" class="block text-sm font-semibold text-slate-900">
				{#if provider === 'github'}
					Personal Access Token
				{:else}
					API Key
				{/if}
			</label>
			<div class="mt-1 relative">
				<input
					id="apiKey"
					type={showPassword.apiKey ? 'text' : 'password'}
					value={config.apiKey}
					oninput={(e) => handleInputChange('apiKey', e.currentTarget.value)}
					class="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					placeholder={provider === 'github' ? 'Enter your Personal Access Token' : 'Enter your API key'}
				/>
				<button
					type="button"
					class="absolute inset-y-0 right-0 flex items-center pr-3"
					onclick={() => togglePasswordVisibility('apiKey')}
				>
					<svg
						class="h-5 w-5 text-slate-400 hover:text-slate-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						{#if showPassword.apiKey}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Model Selection (if models are available) -->
		{#if providerInfo.models.length > 0}
			<div>
				<label for="model" class="block text-sm font-semibold text-slate-900">
					Model
				</label>
				<select
					id="model"
					value={config.model}
					onchange={(e) => handleInputChange('model', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
				>
					{#each providerInfo.models as model}
						<option value={model}>{model}</option>
					{/each}
				</select>
			</div>
		{/if}

		<!-- Endpoint Field (for providers that support it) -->
		{#if providerInfo.configFields.includes('endpoint')}
			<div>
				<label for="endpoint" class="block text-sm font-semibold text-slate-900">
					Endpoint
					<span class="font-normal text-slate-600">(optional)</span>
				</label>
				<input
					id="endpoint"
					type="url"
					value={config.endpoint || ''}
					oninput={(e) => handleInputChange('endpoint', e.currentTarget.value)}
					class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
					placeholder={providerInfo.defaultEndpoint}
				/>
			</div>
		{/if}


		<!-- Connection Test Button -->
		<div class="flex items-center gap-4">
			<button
				type="button"
				class={getTestButtonClass()}
				onclick={onTestConnection}
				disabled={connectionStatus === 'testing' || !config.apiKey}
			>
				{#if connectionStatus === 'testing'}
					<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
					</svg>
				{/if}
				{getTestButtonText()}
			</button>

			<!-- Connection Status -->
			{#if connectionStatus === 'success'}
				<div class="flex items-center text-sm text-emerald-600">
					<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
					Connection successful
				</div>
			{:else if connectionStatus === 'error' && connectionError}
				<div class="flex items-start text-sm text-red-600">
					<svg class="mr-1 mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
					<div class="flex-1">
						<div class="font-medium">Connection failed</div>
						<div class="text-xs text-red-500 mt-1">{connectionError}</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}