<script lang="ts">
	import { getAvailableProviders } from '$lib/constants/aiProviders';
	import type { AIProviderInfo } from '$lib/types';

	interface Props {
		selectedProvider: string;
		onProviderSelect: (providerId: string) => void;
	}

	const { selectedProvider, onProviderSelect }: Props = $props();

	const providers = getAvailableProviders();

	function handleCardClick(provider: AIProviderInfo) {
		onProviderSelect(provider.id);
	}
</script>

<div class="space-y-4">
	<div>
		<h3 class="text-lg font-semibold text-slate-900">AI Provider</h3>
		<p class="text-sm text-slate-600">Choose your preferred AI service for parsing messages</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		{#each providers as provider (provider.id)}
			<div
				class={{
					'cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md': true,
					'border-slate-200 bg-white': selectedProvider !== provider.id,
					'border-emerald-500 bg-emerald-50': selectedProvider === provider.id
				}}
				onclick={() => handleCardClick(provider)}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleCardClick(provider);
					}
				}}
			>
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<h4 class="text-lg font-semibold text-slate-900">
								{provider.name}
							</h4>
							{#if provider.isDefault}
								<span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
									Default
								</span>
							{/if}
						</div>
						{#if provider.description}
							<p class="mt-1 text-sm text-slate-600">
								{provider.description}
							</p>
						{/if}
					</div>
					<div class="ml-4 flex-shrink-0">
						<div
							class="h-5 w-5 rounded-full border-2 border-slate-300 transition-colors"
							class:border-emerald-500={selectedProvider === provider.id}
							class:bg-emerald-500={selectedProvider === provider.id}
						>
							{#if selectedProvider === provider.id}
								<div class="flex h-full items-center justify-center">
									<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
							{/if}
						</div>
					</div>
				</div>

				{#if provider.models.length > 0}
					<div class="mt-2 text-xs text-slate-500">
						Models: {provider.models.slice(0, 2).join(', ')}{provider.models.length > 2
							? `, +${provider.models.length - 2} more`
							: ''}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
