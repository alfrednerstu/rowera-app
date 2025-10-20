<script>
	let {
		primitives = [],
		partials = [],
		selectedItems = $bindable([]),
		label = 'Content Items'
	} = $props()

	let availablePrimitives = $state([...primitives])
	let availablePartials = $state([...partials])
	let itemType = $state('primitive')
	let selectedId = $state('')

	function addItem() {
		if (!selectedId) return

		const item = itemType === 'primitive'
			? availablePrimitives.find(p => p.id === selectedId)
			: availablePartials.find(p => p.id === selectedId)

		if (!item) return

		const newItem = {
			type: itemType,
			id: item.id,
			name: item.name,
			order: selectedItems.length
		}

		selectedItems = [...selectedItems, newItem]
		selectedId = ''
	}

	function removeItem(index) {
		selectedItems = selectedItems.filter((_, i) => i !== index)
		// Update order
		selectedItems = selectedItems.map((item, i) => ({ ...item, order: i }))
	}

	function moveUp(index) {
		if (index === 0) return
		const newItems = [...selectedItems]
		;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
		selectedItems = newItems.map((item, i) => ({ ...item, order: i }))
	}

	function moveDown(index) {
		if (index === selectedItems.length - 1) return
		const newItems = [...selectedItems]
		;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
		selectedItems = newItems.map((item, i) => ({ ...item, order: i }))
	}

	$effect(() => {
		// Filter out already selected items
		const selectedPrimitiveIds = selectedItems.filter(item => item.type === 'primitive').map(item => item.id)
		const selectedPartialIds = selectedItems.filter(item => item.type === 'partial').map(item => item.id)

		availablePrimitives = primitives.filter(p => !selectedPrimitiveIds.includes(p.id))
		availablePartials = partials.filter(p => !selectedPartialIds.includes(p.id))
	})
</script>

<section class="primitive-partial-manager">
	<h3>{label}</h3>

	<div class="add-item">
		<div class="type-selector">
			<label>
				<input type="radio" bind:group={itemType} value="primitive" />
				Primitive
			</label>
			<label>
				<input type="radio" bind:group={itemType} value="partial" />
				Partial
			</label>
		</div>

		<select bind:value={selectedId}>
			<option value="">Select {itemType}</option>
			{#if itemType === 'primitive'}
				{#each availablePrimitives as primitive}
					<option value={primitive.id}>{primitive.name}</option>
				{/each}
			{:else}
				{#each availablePartials as partial}
					<option value={partial.id}>{partial.name}</option>
				{/each}
			{/if}
		</select>

		<button type="button" onclick={addItem}>Add</button>
	</div>

	{#if selectedItems.length > 0}
		<ul class="selected-items">
			{#each selectedItems as item, index}
				<li>
					<span class="item-info">
						<strong>{item.type === 'primitive' ? 'P' : 'Pa'}:</strong> {item.name}
					</span>
					<div class="item-actions">
						<button type="button" onclick={() => moveUp(index)} disabled={index === 0} aria-label="Move up">↑</button>
						<button type="button" onclick={() => moveDown(index)} disabled={index === selectedItems.length - 1} aria-label="Move down">↓</button>
						<button type="button" onclick={() => removeItem(index)} aria-label="Remove">×</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.primitive-partial-manager {
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.add-item {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		align-items: center;
	}

	.type-selector {
		display: flex;
		gap: 1rem;
	}

	.type-selector label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-weight: normal;
	}

	select {
		flex: 1;
		padding: 0.5rem;
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		background: var(--base-color);
	}

	button {
		padding: 0.5rem 1rem;
		white-space: nowrap;
	}

	.selected-items {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.selected-items li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		background: var(--surface-color);
		border: 1px solid var(--quad-color);
		border-radius: 4px;
	}

	.item-info {
		flex: 1;
	}

	.item-actions {
		display: flex;
		gap: 0.25rem;
	}

	.item-actions button {
		padding: 0.25rem 0.5rem;
		min-width: 2rem;
		font-size: 1.1rem;
		line-height: 1;
	}
</style>
