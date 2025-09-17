<script>
	import { crossfade } from 'svelte/transition'
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	let activeTab = $state('pieces')
	
	// Reactive state for each tab's data
	let packets = $state(data.packets)
	let pieces = $state(data.pieces)
	let presets = $state(data.presets)
	
	// Update data when props change
	$effect(() => {
		packets = data.packets
		pieces = data.pieces
		presets = data.presets
	})
	
	// Packets table configuration
	const packetColumns = [
		{ key: 'name', header: 'Packet Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'projectName', header: 'Project' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
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
	
	async function handleDeletePacket(packet) {
		if (confirm(`Are you sure you want to delete "${packet.name}"?`)) {
			try {
				const response = await fetch(`/api/packets/${packet.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Remove from local state without page reload
					packets = packets.filter(p => p.id !== packet.id)
				} else {
					console.error('Failed to delete packet')
				}
			} catch (error) {
				console.error('Error deleting packet:', error)
			}
		}
	}
	
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

	const [send, receive] = crossfade({
    duration: 150
  })
</script>

<svelte:head>
	<title>Pieces - Rowera CMS</title>
	<meta name="description" content="Manage your pieces, packets, and presets" />
</svelte:head>

<nav class="tabs">
    <button onclick={() => activeTab = 'pieces'} class:active={activeTab === 'pieces'}>
        {#if activeTab === 'pieces'}
          <span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
        {/if}
        Pieces
    </button>
    <button onclick={() => activeTab = 'packets'} class:active={activeTab === 'packets'}>
        {#if activeTab === 'packets'}
          <span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
        {/if}
        Packets
    </button>
    <button onclick={() => activeTab = 'presets'} class:active={activeTab === 'presets'}>
        {#if activeTab === 'presets'}
          <span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
        {/if}
        Presets
    </button>
</nav>

{#if activeTab === 'packets'}
	<CrudTable 
		items={packets}
		columns={packetColumns}
		title="Packets"
		createUrl="/pieces/packets/new"
		editUrl={(item) => `/pieces/packets/${item.id}/edit`}
		onDelete={handleDeletePacket}
	/>
{:else if activeTab === 'pieces'}
	<CrudTable 
		items={pieces}
		columns={pieceColumns}
		title="Pieces"
		createUrl="/pieces/new"
		editUrl={(item) => `/pieces/${item.id}/edit`}
		onDelete={handleDeletePiece}
	/>
{:else if activeTab === 'presets'}
	<CrudTable 
		items={presets}
		columns={presetColumns}
		title="Presets"
		createUrl="/pieces/presets/new"
		editUrl={(item) => `/pieces/presets/${item.id}/edit`}
		onDelete={handleDeletePreset}
	/>
{/if}

<style>
	.tabs {
		display: flex;
		width: max-content;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		background: var(--surface-color);
		border-radius: .5rem;
		border: 1px solid var(--quad-color);
		overflow: hidden;
		padding: .25rem;
		gap: .25rem;
	}
	
	.tabs button {
    position: relative;
    z-index: 0;
    padding: .25rem .5rem;
    color: var(--secondary-color);
    background: none;
    font-weight: 500;
    transition: all 0.2s ease;
    border-radius: .25rem;
}
	
	.tabs button:hover {
		color: #495057;
		background: var(--surface-color);
	}
	
	.tabs button.active {
    background: var(--accent-color);
    color: var(--base-color);
}

/* moving active background */
.active-pill {
    position: absolute;
    inset: 0;
    border-radius: .25rem;
    background: var(--accent-color);
    pointer-events: none;
    z-index: -1;
}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
</style>