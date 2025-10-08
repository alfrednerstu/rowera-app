<script>
	let { primitives = $bindable([]), availablePrimitives = [] } = $props()

	let draggedIndex = $state(null)
	let showDropdown = $state(false)
	let selectedPrimitiveId = $state('')

	function toggleDropdown() {
		showDropdown = !showDropdown
		if (!showDropdown) {
			selectedPrimitiveId = ''
		}
	}

	function addPrimitive() {
		if (!selectedPrimitiveId) return

		primitives = [...primitives, {
			id: crypto.randomUUID(),
			primitiveId: selectedPrimitiveId,
			order: primitives.length
		}]

		selectedPrimitiveId = ''
		showDropdown = false
	}

	function removePrimitive(index) {
		primitives = primitives.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i }))
	}

	function handleDragStart(index) {
		draggedIndex = index
	}

	function handleDragOver(e, index) {
		e.preventDefault()
		if (draggedIndex === null || draggedIndex === index) return

		const newPrimitives = [...primitives]
		const draggedItem = newPrimitives[draggedIndex]
		newPrimitives.splice(draggedIndex, 1)
		newPrimitives.splice(index, 0, draggedItem)

		primitives = newPrimitives.map((p, i) => ({ ...p, order: i }))
		draggedIndex = index
	}

	function handleDragEnd() {
		draggedIndex = null
	}

	function getPrimitiveName(primitiveId) {
		const primitive = availablePrimitives.find(p => p.id === primitiveId)
		return primitive?.name || 'Unknown'
	}
</script>

<section class="primitive-builder">
	<h3>Primitives</h3>

	{#if primitives.length === 0}
		<p class="empty-message">No primitives added yet</p>
	{/if}

	<ul class="primitive-list">
		{#each primitives as primitive, index (primitive.id)}
			<li
				class="primitive-item"
				class:dragging={draggedIndex === index}
				draggable="true"
				ondragstart={() => handleDragStart(index)}
				ondragover={(e) => handleDragOver(e, index)}
				ondragend={handleDragEnd}
			>
				<span class="drag-handle" aria-label="Drag to reorder">☰</span>

				<span class="primitive-name">{getPrimitiveName(primitive.primitiveId)}</span>

				<button
					type="button"
					onclick={() => removePrimitive(index)}
					aria-label="Remove primitive"
					class="remove-button"
				>
					Delete
				</button>
			</li>
		{/each}
	</ul>

	{#if showDropdown}
		<div class="dropdown-container">
			<select
				bind:value={selectedPrimitiveId}
				class="primitive-select"
			>
				<option value="">Select a primitive</option>
				{#each availablePrimitives as prim}
					<option value={prim.id}>{prim.name}</option>
				{/each}
			</select>

			<div class="dropdown-actions">
				<button type="button" onclick={addPrimitive} class="confirm-button">
					Add
				</button>
				<button type="button" onclick={toggleDropdown} class="cancel-button">
					Cancel
				</button>
			</div>
		</div>
	{:else}
		<button type="button" onclick={toggleDropdown} class="add-button">
			+ Add Primitive
		</button>
	{/if}
</section>

<style>
	.primitive-builder {
		margin: 1.5rem 0;
		padding: 1.5rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: #fafafa;
	}

	h3 {
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.empty-message {
		color: #666;
		font-style: italic;
		margin: 1rem 0;
	}

	.primitive-list {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem 0;
	}

	.primitive-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		margin-bottom: 0.5rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: move;
		transition: opacity 0.2s, transform 0.2s;
	}

	.primitive-item:hover {
		border-color: #999;
	}

	.primitive-item.dragging {
		opacity: 0.5;
	}

	.drag-handle {
		cursor: grab;
		color: #999;
		font-size: 1.2rem;
		user-select: none;
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.primitive-name {
		flex: 1;
		font-weight: 500;
	}

	.remove-button {
		padding: 0.5rem 1rem;
		background: #f44336;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.remove-button:hover {
		background: #d32f2f;
	}

	.dropdown-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.primitive-select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.dropdown-actions {
		display: flex;
		gap: 0.5rem;
	}

	.confirm-button {
		flex: 1;
		padding: 0.75rem 1.5rem;
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
	}

	.confirm-button:hover {
		background: #45a049;
	}

	.cancel-button {
		flex: 1;
		padding: 0.75rem 1.5rem;
		background: #6c757d;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
	}

	.cancel-button:hover {
		background: #545b62;
	}

	.add-button {
		padding: 0.75rem 1.5rem;
		background: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		width: 100%;
	}

	.add-button:hover {
		background: #45a049;
	}
</style>
