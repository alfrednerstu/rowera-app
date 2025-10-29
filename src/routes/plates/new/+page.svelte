<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	let items = $state([])

	const fields = [
		{
			name: 'name',
			label: 'Plate Name',
			type: 'text',
			placeholder: 'Enter plate name',
			required: true
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea',
			placeholder: 'Optional description'
		}
	]

	function addPartial(partialId) {
		items = [...items, {
			order: items.length,
			partialId,
			isContentSlot: false
		}]
	}

	function addContentSlot() {
		items = [...items, {
			order: items.length,
			partialId: null,
			isContentSlot: true
		}]
	}

	function removeItem(index) {
		items = items.filter((_, i) => i !== index).map((item, i) => ({
			...item,
			order: i
		}))
	}

	function moveUp(index) {
		if (index === 0) return
		const newItems = [...items]
		;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
		items = newItems.map((item, i) => ({ ...item, order: i }))
	}

	function moveDown(index) {
		if (index === items.length - 1) return
		const newItems = [...items]
		;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
		items = newItems.map((item, i) => ({ ...item, order: i }))
	}

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/plates', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					items
				})
			})

			if (response.ok) {
				goto('/plates')
			} else {
				console.error('Failed to create plate')
			}
		} catch (error) {
			console.error('Error creating plate:', error)
		}
	}
</script>

<CrudForm
	title="Create Plate"
	{fields}
	item={{ name: '', description: '' }}
	submitLabel="Create Plate"
	cancelUrl="/plates"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		<section class="field-box">
			<header class="field-box-header">
				<h2>Plate Structure</h2>
			</header>
			<div class="field-box-content">
				<div class="items-list">
					{#each items as item, index}
						<div class="item">
							<div class="item-content">
								{#if item.isContentSlot}
									<strong>Content Slot</strong> (Main page content)
								{:else}
									{data.partials.find(p => p.id === item.partialId)?.name || 'Unknown partial'}
								{/if}
							</div>
							<div class="item-actions">
								<button type="button" onclick={() => moveUp(index)} disabled={index === 0}>↑</button>
								<button type="button" onclick={() => moveDown(index)} disabled={index === items.length - 1}>↓</button>
								<button type="button" onclick={() => removeItem(index)}>Remove</button>
							</div>
						</div>
					{/each}
					{#if items.length === 0}
						<p class="empty-message">No items yet. Add partials or a content slot below.</p>
					{/if}
				</div>

				<div class="add-buttons">
					<button type="button" onclick={addContentSlot}>Add Content Slot</button>
					{#if data.partials.length > 0}
						<select onchange={(e) => {
							if (e.target.value) {
								addPartial(e.target.value)
								e.target.value = ''
							}
						}}>
							<option value="">Add Partial...</option>
							{#each data.partials as partial}
								<option value={partial.id}>{partial.name}</option>
							{/each}
						</select>
					{/if}
				</div>
			</div>
		</section>
	{/snippet}
</CrudForm>

<style>
	.items-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: var(--base-color);
		border: 1px solid var(--quad-color);
		border-radius: 4px;
	}

	.item-content {
		flex: 1;
	}

	.item-actions {
		display: flex;
		gap: 0.5rem;
	}

	.item-actions button {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
	}

	.empty-message {
		text-align: center;
		color: var(--text-color);
		opacity: 0.6;
		padding: 2rem;
	}

	.add-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.add-buttons select {
		flex: 1;
	}

	.field-box-header h2 {
		margin: 0;
		font-weight: 600;
		font-size: 1rem;
	}
</style>
