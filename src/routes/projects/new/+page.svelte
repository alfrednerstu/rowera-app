<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
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
			const response = await fetch('/api/projects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/')
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
	cancelUrl="/"
	onSubmit={handleSubmit}
/>