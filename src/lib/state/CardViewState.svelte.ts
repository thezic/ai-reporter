import { SvelteSet } from 'svelte/reactivity';

export class CardViewState {
	expandedCards = $state(new SvelteSet<string>());

	constructor() {}

	toggleExpansion = (publisherId: string) => {
		if (this.expandedCards.has(publisherId)) {
			this.expandedCards.delete(publisherId);
		} else {
			// Auto-collapse others for single expansion
			this.expandedCards.clear();
			this.expandedCards.add(publisherId);
		}
	};

	collapseAll() {
		this.expandedCards.clear();
	}

	isExpanded(publisherId: string): boolean {
		return this.expandedCards.has(publisherId);
	}
}
