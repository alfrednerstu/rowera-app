<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'

	const fields = [
		{
			name: 'title',
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
		}
	]

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/pages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
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
	title="Create Page"
	{fields}
	submitLabel="Create Page"
	cancelUrl="/pages"
	onSubmit={handleSubmit}
/>
