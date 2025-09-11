export class CardViewState {
	expandedCards = $state(new Set<string>());

	constructor() {}

	toggleExpansion = (publisherId: string) => {
		if (this.expandedCards.has(publisherId)) {
			this.expandedCards.delete(publisherId);
		} else {
			// Auto-collapse others for single expansion
			this.expandedCards.clear();
			this.expandedCards.add(publisherId);
		}
		// Trigger reactivity
		this.expandedCards = new Set(this.expandedCards);
	};

	collapseAll() {
		this.expandedCards.clear();
		this.expandedCards = new Set(this.expandedCards);
	}

	isExpanded(publisherId: string): boolean {
		return this.expandedCards.has(publisherId);
	}
}
