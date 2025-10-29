<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import ContentEditor from '$lib/components/ContentEditor.svelte'
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
			required: false
		}
	]

	let primitives = $state([])

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/pages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					primitives
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
		<ContentEditor bind:primitives availablePrimitives={data.primitives} mode="full" />
	{/snippet}
</CrudForm>
