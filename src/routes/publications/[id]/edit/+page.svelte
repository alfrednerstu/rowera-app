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
			// Keep the existing project ID - publications shouldn't move between projects
			const formDataWithProject = {
				...formData,
				projectId: data.publication.projectId
			}
			
			const response = await fetch(`/api/publications/${data.publication.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formDataWithProject)
			})
			
			if (response.ok) {
				goto('/publications')
			} else {
				console.error('Failed to update publication')
			}
		} catch (error) {
			console.error('Error updating publication:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Publication"
	{fields}
	item={data.publication}
	submitLabel="Update Publication"
	cancelUrl="/publications"
	onSubmit={handleSubmit}
/>