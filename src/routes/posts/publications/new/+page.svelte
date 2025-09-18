<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
	const fields = [
		{
			name: 'name',
			label: 'Publication Name',
			type: 'text',
			placeholder: 'Enter publication name',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'publication-url-slug',
			required: true
		}
	]
	
	async function handleSubmit(formData) {
		try {
			// Add the active project ID to the form data
			const formDataWithProject = {
				...formData,
				projectId: data.activeProject?.id
			}
			
			const response = await fetch('/api/publications', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formDataWithProject)
			})
			
			if (response.ok) {
				goto('/posts')
			} else {
				console.error('Failed to create publication')
			}
		} catch (error) {
			console.error('Error creating publication:', error)
		}
	}
</script>

<CrudForm 
	title="Create Publication"
	{fields}
	submitLabel="Create Publication"
	cancelUrl="/posts"
	onSubmit={handleSubmit}
/>