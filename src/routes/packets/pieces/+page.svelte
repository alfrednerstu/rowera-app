<script>
	import CrudTable from '$lib/components/CrudTable.svelte'

	let { data } = $props()
	let pieces = $state(data.pieces)
	
	// Update pieces when data changes
	$effect(() => {
		pieces = data.pieces
	})
	
	// Pieces table configuration
	const pieceColumns = [
		{ key: 'name', header: 'Piece Name' },
		{ key: 'slug', header: 'Slug' },
		{ 
			key: 'packetName', 
			header: 'Packet',
			render: (item) => `<a href="/packets/${item.packetId}/edit?return=/packets/pieces" class="link">${item.packetName}</a>`
		},
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
					// Remove from local state without page reload
					pieces = pieces.filter(p => p.id !== piece.id)
				} else {
					console.error('Failed to delete piece')
				}
			} catch (error) {
				console.error('Error deleting piece:', error)
			}
		}
	}
</script>

<CrudTable 
	items={pieces}
	columns={pieceColumns}
	title="Pieces"
	createUrl="/packets/pieces/new"
	editUrl={(item) => `/packets/pieces/${item.id}/edit`}
	onDelete={handleDeletePiece}
/>

<style>
	:global(.link) {
		color: var(--accent-color);
		text-decoration: none;
	}
	
	:global(.link:hover) {
		text-decoration: underline;
	}
</style>