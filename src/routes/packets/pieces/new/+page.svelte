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
			const response = await fetch('/api/pieces', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/packets/pieces')
			} else {
				console.error('Failed to create piece')
			}
		} catch (error) {
			console.error('Error creating piece:', error)
		}
	}
</script>

<CrudForm 
	title="Create Piece"
	{fields}
	submitLabel="Create Piece"
	cancelUrl="/packets/pieces"
	onSubmit={handleSubmit}
/>