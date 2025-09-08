<script lang="ts">
	interface Props {
		onParse: () => void;
		onExportCsv: () => void;
		onExportExcel: () => void;
		onClearReports: () => void;
		isLoading?: boolean;
		canParse?: boolean;
	}

	let {
		onParse,
		onExportCsv,
		onExportExcel,
		onClearReports,
		isLoading = false,
		canParse = true
	}: Props = $props();
</script>

<div class="flex flex-wrap gap-4">
	<button
		onclick={onParse}
		disabled={!canParse || isLoading}
		class="flex items-center gap-2 rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
	>
		{#if isLoading}
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
			></div>
		{/if}
		Parse Messages
	</button>

	<div class="flex gap-2">
		<button
			onclick={onExportCsv}
			class="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
		>
			Export CSV
		</button>

		<button
			onclick={onExportExcel}
			class="rounded bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-800"
		>
			Export Excel
		</button>
	</div>

	<button
		onclick={onClearReports}
		class="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
	>
		Clear Reports
	</button>
</div>
