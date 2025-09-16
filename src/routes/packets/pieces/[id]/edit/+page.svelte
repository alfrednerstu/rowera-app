<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
	const fields = [
		{
			name: 'name',
			label: 'Piece Name',
			type: 'text',
			placeholder: 'Enter piece name',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'piece-slug',
			required: true
		},
		{
			name: 'packetId',
			label: 'Packet',
			type: 'select',
			required: true,
			options: data.packets.map(p => ({ value: p.id, label: `${p.name} (${p.projectName})` }))
		},
		{
			name: 'presetId',
			label: 'Preset',
			type: 'select',
			required: true,
			options: data.presets.map(p => ({ value: p.id, label: `${p.name} (${p.publicationName})` }))
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/pieces/${data.piece.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/packets')
			} else {
				console.error('Failed to update piece')
			}
		} catch (error) {
			console.error('Error updating piece:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Piece"
	{fields}
	item={data.piece}
	submitLabel="Update Piece"
	cancelUrl="/packets"
	onSubmit={handleSubmit}
/>