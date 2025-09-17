<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
	const fields = [
		{
			name: 'name',
			label: 'Packet Name',
			type: 'text',
			placeholder: 'Enter packet name',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'packet-url-slug',
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
			const response = await fetch('/api/packets', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/pieces')
			} else {
				console.error('Failed to create packet')
			}
		} catch (error) {
			console.error('Error creating packet:', error)
		}
	}
</script>

<CrudForm 
	title="Create Packet"
	{fields}
	submitLabel="Create Packet"
	cancelUrl="/pieces"
	onSubmit={handleSubmit}
/>