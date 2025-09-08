<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>AI Service Reporter</title>
</svelte:head>

{@render children?.()}
