<script lang="ts">
	interface Props {
		onParse: () => void;
		onExportCsv: () => void;
		onExportExcel: () => void;
		onClearReports: () => void;
		isLoading?: boolean;
		canParse?: boolean;
		isMobile?: boolean;
	}

	let {
		onParse,
		onExportCsv,
		onExportExcel,
		onClearReports,
		isLoading = false,
		canParse = true,
		isMobile = false
	}: Props = $props();
</script>

<div class={isMobile ? '' : 'rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200'}>
	<div class="space-y-4">
		<!-- Primary Action -->
		<button
			onclick={onParse}
			disabled={!canParse || isLoading}
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500"
		>
			{#if isLoading}
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
				></div>
			{/if}
			Parse Messages
		</button>

		<!-- Secondary Actions -->
		<div class="space-y-3">
			<div class="flex gap-3">
				<button
					onclick={onExportCsv}
					class={[
						'flex-1 rounded-lg px-4 py-2.5 font-medium text-slate-700 transition-colors',
						isMobile 
							? 'border border-slate-300 bg-transparent hover:bg-slate-100' 
							: 'bg-slate-100 hover:bg-slate-200'
					]}
				>
					Export CSV
				</button>

				<button
					onclick={onExportExcel}
					class={[
						'flex-1 rounded-lg px-4 py-2.5 font-medium text-slate-700 transition-colors',
						isMobile 
							? 'border border-slate-300 bg-transparent hover:bg-slate-100' 
							: 'bg-slate-100 hover:bg-slate-200'
					]}
				>
					Export Excel
				</button>
			</div>

			<button
				onclick={onClearReports}
				class="w-full rounded-lg bg-red-50 px-4 py-2.5 font-medium text-red-700 transition-colors hover:bg-red-100"
			>
				Clear Reports
			</button>
		</div>
	</div>
</div>
