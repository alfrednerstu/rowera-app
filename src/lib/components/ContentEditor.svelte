<script>
	let {
		primitives = $bindable([]),
		availablePrimitives = [],
		mode = 'full' // 'full' (add+edit+content), 'template' (add+edit), 'content' (content only)
	} = $props()

	let showDialog = $state(false)
	let draggedIndex = $state(null)

	// Group primitives by category
	const categorizedPrimitives = $derived(() => {
		const categories = {
			content: [],
			media: [],
			interactive: [],
			layout: []
		}

		availablePrimitives.forEach(prim => {
			const category = prim.category || 'content'
			if (categories[category]) {
				categories[category].push(prim)
			}
		})

		return categories
	})

	const categoryLabels = {
		content: 'Content',
		media: 'Media',
		interactive: 'Interactive',
		layout: 'Layout'
	}

	function openDialog() {
		showDialog = true
	}

	function closeDialog() {
		showDialog = false
	}

	function selectPrimitive(primitiveId) {
		const primitive = availablePrimitives.find(p => p.id === primitiveId)
		if (!primitive) return

		primitives = [...primitives, {
			id: crypto.randomUUID(),
			primitiveId: primitiveId,
			primitiveName: primitive.name,
			primitiveFields: primitive.fields || [],
			order: primitives.length,
			content: {}
		}]

		closeDialog()
	}

	function removePrimitive(index) {
		primitives = primitives.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i }))
	}

	function moveUp(index) {
		if (index === 0) return
		const newPrimitives = [...primitives]
		;[newPrimitives[index - 1], newPrimitives[index]] = [newPrimitives[index], newPrimitives[index - 1]]
		primitives = newPrimitives.map((p, i) => ({ ...p, order: i }))
	}

	function moveDown(index) {
		if (index === primitives.length - 1) return
		const newPrimitives = [...primitives]
		;[newPrimitives[index], newPrimitives[index + 1]] = [newPrimitives[index + 1], newPrimitives[index]]
		primitives = newPrimitives.map((p, i) => ({ ...p, order: i }))
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

	function getPrimitive(primitiveId) {
		return availablePrimitives.find(p => p.id === primitiveId)
	}
</script>

<section class="content-editor">
	{#if primitives.length === 0}
		<p class="empty-message">No content added yet. Click the + button below to add primitives.</p>
	{/if}

	<ul class="primitive-list">
		{#each primitives as item, index (item.id)}
			<li class="field-box">
				<header class="field-box-header">
					<span class="drag-handle" aria-label="Drag to reorder" draggable="true" ondragstart={() => handleDragStart(index)}>☰</span>
					<h2>{item.primitiveName}</h2>
					<div class="primitive-actions">
						<button type="button" onclick={() => moveUp(index)} disabled={index === 0} aria-label="Move up" class="icon-button">↑</button>
						<button type="button" onclick={() => moveDown(index)} disabled={index === primitives.length - 1} aria-label="Move down" class="icon-button">↓</button>
						<button type="button" onclick={() => removePrimitive(index)} aria-label="Remove" class="icon-button danger">×</button>
					</div>
				</header>

				{#if mode === 'full' || mode === 'content'}
					<div class="field-box-content"
						class:dragging={draggedIndex === index}
						ondragover={(e) => handleDragOver(e, index)}
						ondragend={handleDragEnd}
					>
						{#if item.primitiveFields && item.primitiveFields.length > 0}
							{#each item.primitiveFields as field}
								<div class="field">
									<label for="{item.id}-{field.name}">{field.label}</label>
									{#if field.type === 'textarea'}
										<textarea
											id="{item.id}-{field.name}"
											bind:value={item.content[field.name]}
											placeholder={field.placeholder || ''}
											required={!field.optional}
										></textarea>
									{:else if field.type === 'variant'}
										<select
											id="{item.id}-{field.name}"
											bind:value={item.content[field.name]}
											required={!field.optional}
										>
											<option value="">Select {field.label}</option>
											<!-- Extract variant options from primitive tags -->
											{#if getPrimitive(item.primitiveId)?.tags.includes('variant:')}
												{@const variantMatch = getPrimitive(item.primitiveId).tags.match(/variant:([^}]+)/)}
												{#if variantMatch}
													{@const options = variantMatch[1].split(',')}
													{#each options as option}
														<option value={option}>{option}</option>
													{/each}
												{/if}
											{/if}
										</select>
									{:else}
										<input
											id="{item.id}-{field.name}"
											type={field.type === 'url' ? 'url' : 'text'}
											bind:value={item.content[field.name]}
											placeholder={field.placeholder || ''}
											required={!field.optional}
										/>
									{/if}
								</div>
							{/each}
						{/if}
					</div>
				{/if}
			</li>
		{/each}
	</ul>

	{#if mode === 'full' || mode === 'template'}
		<div class="add-button-container">
			<button type="button" onclick={openDialog} class="add-button" aria-label="Add primitive">
				+
			</button>
		</div>
	{/if}
</section>

{#if showDialog}
	<div class="dialog-overlay" onclick={closeDialog}>
		<div class="dialog" onclick={(e) => e.stopPropagation()}>
			<header class="dialog-header">
				<h3>Add Primitive</h3>
				<button type="button" onclick={closeDialog} class="close-button" aria-label="Close">×</button>
			</header>

			<div class="dialog-content">
				{#each Object.entries(categorizedPrimitives()) as [category, prims]}
					{#if prims.length > 0}
						<section class="category-section">
							<h4>{categoryLabels[category]}</h4>
							<ul class="primitive-grid">
								{#each prims as prim}
									<li>
										<button
											type="button"
											class="primitive-card"
											onclick={() => selectPrimitive(prim.id)}
										>
											<strong>{prim.name}</strong>
											<p>{prim.description}</p>
										</button>
									</li>
								{/each}
							</ul>
						</section>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.content-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		position: relative;
		padding-bottom: 4rem;
	}

	.empty-message {
		color: var(--secondary-color);
		opacity: 0.75;
		font-style: italic;
		text-align: center;
		margin: 2rem 0;
	}

	.primitive-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-box {
		background: var(--base-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		overflow: hidden;
	}

	.field-box-header {
		background: var(--surface-color);
		padding: 1rem;
		border-bottom: 1px solid var(--quad-color);
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.field-box-header h2 {
		margin: 0;
		font-weight: 600;
		font-size: 1rem;
		flex: 1;
	}

	.field-box-content {
		background: var(--base-color);
		padding: 1rem;
		transition: opacity 0.2s;
	}

	.field-box-content.dragging {
		opacity: 0.5;
	}

	.drag-handle {
		cursor: grab;
		color: var(--secondary-color);
		font-size: 1.2rem;
		user-select: none;
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.primitive-actions {
		display: flex;
		gap: 0.25rem;
	}

	.icon-button {
		padding: 0.25rem 0.5rem;
		background: var(--secondary-color);
		color: var(--base-color);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1.1rem;
		line-height: 1;
		min-width: 2rem;
	}

	.icon-button:hover {
		opacity: 0.9;
	}

	.icon-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.icon-button.danger {
		background: var(--accent-color);
	}

	.field {
		margin-bottom: 1rem;
	}

	.field:last-child {
		margin-bottom: 0;
	}

	.field label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.field input,
	.field textarea,
	.field select {
		width: 100%;
		padding: 0.75rem;
		border: none;
		font-size: 1rem;
		font-family: inherit;
		background: transparent;
	}

	.field input:focus,
	.field textarea:focus,
	.field select:focus {
		outline: none;
	}

	.field textarea {
		min-height: 100px;
		resize: vertical;
	}

	.add-button-container {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
	}

	.add-button {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: var(--accent-color);
		color: var(--base-color);
		border: none;
		font-size: 2rem;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		transition: transform 0.2s, box-shadow 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		line-height: 0;
	}

	.add-button:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.dialog-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.dialog {
		background: var(--base-color);
		border-radius: 12px;
		max-width: 800px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--quad-color);
	}

	.dialog-header h3 {
		margin: 0;
		font-size: 1.5rem;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 2rem;
		line-height: 1;
		cursor: pointer;
		color: var(--secondary-color);
		padding: 0;
		width: 2rem;
		height: 2rem;
	}

	.close-button:hover {
		color: var(--primary-color);
	}

	.dialog-content {
		padding: 1.5rem;
		overflow-y: auto;
	}

	.category-section {
		margin-bottom: 2rem;
	}

	.category-section:last-child {
		margin-bottom: 0;
	}

	.category-section h4 {
		margin: 0 0 1rem 0;
		font-size: 1.2rem;
		color: var(--accent-color);
	}

	.primitive-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.primitive-card {
		width: 100%;
		padding: 1rem;
		background: var(--surface-color);
		border: 1px solid var(--quad-color);
		border-radius: 8px;
		cursor: pointer;
		text-align: left;
		transition: border-color 0.2s, transform 0.2s;
	}

	.primitive-card:hover {
		border-color: var(--accent-color);
		transform: translateY(-2px);
	}

	.primitive-card strong {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.primitive-card p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--secondary-color);
		line-height: 1.4;
	}
</style>
