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

<div class="min-h-screen bg-slate-50">
	<Header onNavigateToSettings={handleNavigateToSettings} onNavigateToHome={handleNavigateToHome} />

	<main class="container mx-auto p-6 lg:p-8">
		{@render children()}
	</main>
</div>
