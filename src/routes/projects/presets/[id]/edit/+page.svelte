<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
	const fields = [
		{
			name: 'name',
			label: 'Preset Name',
			type: 'text',
			placeholder: 'Enter preset name',
			required: true
		},
		{
			name: 'projectId',
			label: 'Project',
			type: 'select',
			required: true,
			options: data.projects.map(project => ({
				value: project.id,
				label: `${project.name} (${project.productName})`
			}))
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/presets/${data.preset.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/projects')
			} else {
				console.error('Failed to update preset')
			}
		} catch (error) {
			console.error('Error updating preset:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Project Preset"
	{fields}
	item={data.preset}
	submitLabel="Update Preset"
	cancelUrl="/projects"
	onSubmit={handleSubmit}
/>