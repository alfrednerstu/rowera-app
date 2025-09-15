<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
	const fields = [
		{
			name: 'name',
			label: 'Project Name',
			type: 'text',
			placeholder: 'Enter project name',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'project-slug',
			required: true
		},
		{
			name: 'productId',
			label: 'Product',
			type: 'select',
			required: true,
			options: data.products.map(p => ({ value: p.id, label: p.name }))
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/projects/${data.project.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/projects')
			} else {
				console.error('Failed to update project')
			}
		} catch (error) {
			console.error('Error updating project:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Project"
	{fields}
	item={data.project}
	submitLabel="Update Project"
	cancelUrl="/projects"
	onSubmit={handleSubmit}
/>