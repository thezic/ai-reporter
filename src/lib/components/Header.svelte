<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		onNavigateToSettings: () => void;
		onNavigateToHome: () => void;
	}

	let { onNavigateToSettings, onNavigateToHome }: Props = $props();

	const isSettingsPage = $derived($page.route.id === '/settings');
</script>

<header class="bg-slate-900 p-6 text-white shadow-sm">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center gap-6">
			{#if isSettingsPage}
				<button
					onclick={onNavigateToHome}
					class="text-slate-300 transition-colors hover:text-white"
				>
					← Back
				</button>
			{/if}
			<h1 class="text-2xl font-semibold text-white">AI Service Reporter</h1>
		</div>

		{#if !isSettingsPage}
			<button
				onclick={onNavigateToSettings}
				class="rounded-lg bg-slate-800 p-2.5 transition-colors hover:bg-slate-700"
				title="Settings"
				aria-label="Settings"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					></path>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					></path>
				</svg>
			</button>
		{/if}
	</div>
</header>
