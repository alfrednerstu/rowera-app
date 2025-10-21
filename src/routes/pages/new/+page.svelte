<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import PrimitivePartialManager from '$lib/components/PrimitivePartialManager.svelte'
	import ContentBuilder from '$lib/components/ContentBuilder.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	const fields = [
		{
			name: 'title',
			label: 'Name',
			type: 'text',
			placeholder: 'Enter page name',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'page-url-slug',
			required: true
		}
	]

	let selectedItems = $state([])
	let contentData = $state([])

	// Build content items for ContentBuilder
	let contentItems = $derived(selectedItems.map(item => {
		if (item.type === 'primitive') {
			return {
				primitiveId: item.id,
				type: 'primitive'
			}
		} else {
			return {
				partialId: item.id,
				type: 'partial'
			}
		}
	}))

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/pages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					content: contentData
				})
			})

			if (response.ok) {
				goto('/pages')
			} else {
				console.error('Failed to create page')
			}
		} catch (error) {
			console.error('Error creating page:', error)
		}
	}
</script>

<CrudForm
	title="Create page"
	{fields}
	submitLabel="Create page"
	cancelUrl="/pages"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		<PrimitivePartialManager
			primitives={data.primitives}
			partials={data.partials}
			bind:selectedItems
			label="Page Content"
		/>

		{#if selectedItems.length > 0}
			<ContentBuilder
				{contentItems}
				primitives={data.primitives}
				partials={data.partials}
				bind:contentData
				label="Fill in content"
			/>
		{/if}
	{/snippet}
</CrudForm>
