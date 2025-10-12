<script>
	import CrudTable from '$lib/components/CrudTable.svelte'

	let { data } = $props()
	let presets = $state(data.presets)

	// Update data when props change
	$effect(() => {
		presets = data.presets
	})

	// Presets table configuration
	const presetColumns = [
		{ key: 'name', header: 'Preset Name', microformatClass: 'p-name' },
		{ key: 'publicationName', header: 'Publication' },
		{
			key: 'createdAt',
			header: 'Created',
			microformatClass: 'dt-published',
			render: (item) => {
				const date = new Date(item.createdAt)
				return `<time datetime="${date.toISOString()}">${date.toLocaleDateString()}</time>`
			}
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
	createUrl="/publications/presets/new"
	editUrl={(item) => `/publications/presets/${item.id}/edit`}
	onDelete={handleDeletePreset}
/>
