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
				goto('/')
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
	cancelUrl="/"
	onSubmit={handleSubmit}
/>