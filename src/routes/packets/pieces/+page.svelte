<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	import PacketsNavigation from '$lib/components/PacketsNavigation.svelte'
	
	let { data } = $props()
	
	// Pieces table configuration
	const pieceColumns = [
		{ key: 'name', header: 'Piece Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'packetName', header: 'Packet' },
		{ key: 'presetName', header: 'Preset' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDeletePiece(piece) {
		if (confirm(`Are you sure you want to delete "${piece.name}"?`)) {
			try {
				const response = await fetch(`/api/pieces/${piece.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					window.location.reload()
				} else {
					console.error('Failed to delete piece')
				}
			} catch (error) {
				console.error('Error deleting piece:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Pieces - Rowera CMS</title>
	<meta name="description" content="Manage your pieces" />
</svelte:head>

<PacketsNavigation activeRoute="/packets/pieces" />

<CrudTable 
	items={data.pieces}
	columns={pieceColumns}
	title="Pieces"
	createUrl="/packets/pieces/new"
	editUrl={(item) => `/packets/pieces/${item.id}/edit`}
	onDelete={handleDeletePiece}
/>