<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		onNavigateToSettings: () => void;
		onNavigateToHome: () => void;
	}

	let { onNavigateToSettings, onNavigateToHome }: Props = $props();

	const isSettingsPage = $derived($page.route.id === '/settings');
</script>

<header class="bg-blue-600 p-4 text-white shadow-lg">
	<div class="container mx-auto flex items-center justify-between">
		<div class="flex items-center gap-4">
			{#if isSettingsPage}
				<button onclick={onNavigateToHome} class="text-blue-200 transition-colors hover:text-white">
					← Back
				</button>
			{/if}
			<h1 class="text-xl font-bold">AI Service Reporter</h1>
		</div>

		{#if !isSettingsPage}
			<button
				onclick={onNavigateToSettings}
				class="rounded bg-blue-700 px-4 py-2 transition-colors hover:bg-blue-800"
			>
				Settings
			</button>
		{/if}
	</div>
</header>
