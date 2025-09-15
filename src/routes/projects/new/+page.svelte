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
			placeholder: 'project-url-slug',
			required: true
		},
		{
			name: 'productId',
			label: 'Product',
			type: 'select',
			required: true,
			options: data.products.map(product => ({
				value: product.id,
				label: product.name
			}))
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/projects')
			} else {
				console.error('Failed to create project')
			}
		} catch (error) {
			console.error('Error creating project:', error)
		}
	}
</script>

<CrudForm 
	title="Create Project"
	{fields}
	submitLabel="Create Project"
	cancelUrl="/projects"
	onSubmit={handleSubmit}
/>