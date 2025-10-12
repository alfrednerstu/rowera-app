<script>
	import CrudTable from '$lib/components/CrudTable.svelte'

	let { data } = $props()
	let presets = $state(data.presets)
	
	// Update presets when data changes
	$effect(() => {
		presets = data.presets
	})
	
	// Presets table configuration
	const presetColumns = [
		{ key: 'name', header: 'Preset Name' },
		{ key: 'packetName', header: 'Packet' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDeletePreset(preset) {
		if (confirm(`Are you sure you want to delete "${preset.name}"?`)) {
			try {
				const response = await fetch(`/api/presets/${preset.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Remove from local state without page reload
					presets = presets.filter(p => p.id !== preset.id)
				} else {
					console.error('Failed to delete preset')
				}
			} catch (error) {
				console.error('Error deleting preset:', error)
			}
		}
	}
</script>

<CrudTable 
	items={presets}
	columns={presetColumns}
	title="Presets"
	createUrl="/packets/presets/new"
	editUrl={(item) => `/packets/presets/${item.id}/edit`}
	onDelete={handleDeletePreset}
/>