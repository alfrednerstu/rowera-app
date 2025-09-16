<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
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