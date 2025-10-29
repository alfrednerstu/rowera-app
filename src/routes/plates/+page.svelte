<script>
	import CrudTable from '$lib/components/CrudTable.svelte'

	let { data } = $props()
	let plates = $state(data.plates)

	// Update plates when data changes
	$effect(() => {
		plates = data.plates
	})

	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'description', header: 'Description' },
		{
			key: 'createdAt',
			header: 'Created',
			render: (item) => {
				const date = new Date(item.createdAt)
				return `<time datetime="${date.toISOString()}">${date.toLocaleDateString()}</time>`
			}
		}
	]

	async function handleDelete(plate) {
		if (confirm(`Are you sure you want to delete "${plate.name}"?`)) {
			try {
				const response = await fetch(`/api/plates/${plate.id}`, {
					method: 'DELETE'
				})

				if (response.ok) {
					// Remove from local state without page reload
					plates = plates.filter(p => p.id !== plate.id)
				} else {
					console.error('Failed to delete plate')
				}
			} catch (error) {
				console.error('Error deleting plate:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Plates - Rowera CMS</title>
	<meta name="description" content="Manage your plates" />
</svelte:head>

<CrudTable
	items={plates}
	{columns}
	title="Plates"
	createUrl="/plates/new"
	editUrl={(item) => `/plates/${item.id}/edit`}
	onDelete={handleDelete}
/>
