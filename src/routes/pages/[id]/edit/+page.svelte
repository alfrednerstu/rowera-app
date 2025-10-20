<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import ContentEditor from '$lib/components/ContentEditor.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	let primitives = $state(data.page.primitives || [])

	const fields = [
		{
			name: 'name',
			label: 'Page Name',
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
		},
		{
			name: 'projectId',
			label: 'Project',
			type: 'select',
			required: true,
			options: data.projects.map(project => ({
				value: project.id,
				label: project.name
			}))
		}
	]

	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/pages/${data.page.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					primitives
				})
			})

			if (response.ok) {
				goto('/pages')
			} else {
				console.error('Failed to update page')
			}
		} catch (error) {
			console.error('Error updating page:', error)
		}
	}
</script>

<CrudForm
	title="Edit Page"
	{fields}
	item={data.page}
	submitLabel="Update Page"
	cancelUrl="/pages"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		<ContentEditor bind:primitives availablePrimitives={data.primitives} mode="full" />
	{/snippet}
</CrudForm>