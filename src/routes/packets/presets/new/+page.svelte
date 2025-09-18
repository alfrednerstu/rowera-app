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
			name: 'packetId',
			label: 'Packet',
			type: 'select',
			required: true,
			options: data.packets.map(packet => ({
				value: packet.id,
				label: packet.name
			}))
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/presets', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/packets/presets')
			} else {
				console.error('Failed to create preset')
			}
		} catch (error) {
			console.error('Error creating preset:', error)
		}
	}
</script>

<CrudForm 
	title="Create Packet Preset"
	{fields}
	submitLabel="Create Preset"
	cancelUrl="/packets/presets"
	onSubmit={handleSubmit}
/>