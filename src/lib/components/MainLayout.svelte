<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	function handleNavigateToSettings() {
		goto('/settings');
	}

	function handleNavigateToHome() {
		goto('/');
	}
</script>

<div class="flex h-screen flex-col bg-slate-50">
	<Header onNavigateToSettings={handleNavigateToSettings} onNavigateToHome={handleNavigateToHome} />

	<main class="flex-1 overflow-y-auto px-2 py-4 md:px-6">
		{@render children()}
	</main>
</div>
