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
			const response = await fetch(`/api/publications/${data.publication.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/posts')
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
	cancelUrl="/posts"
	onSubmit={handleSubmit}
/>