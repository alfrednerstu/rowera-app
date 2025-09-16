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
			placeholder: 'packet-slug',
			required: true
		},
		{
			name: 'projectId',
			label: 'Project',
			type: 'select',
			required: true,
			options: data.projects.map(p => ({ value: p.id, label: p.name }))
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/packets/${data.packet.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/packets')
			} else {
				console.error('Failed to update packet')
			}
		} catch (error) {
			console.error('Error updating packet:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Packet"
	{fields}
	item={data.packet}
	submitLabel="Update Packet"
	cancelUrl="/packets"
	onSubmit={handleSubmit}
/>