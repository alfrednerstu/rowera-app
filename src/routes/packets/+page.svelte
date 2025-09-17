<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	import PacketsNavigation from '$lib/components/PacketsNavigation.svelte'
	
	let { data } = $props()
	let packets = $state(data.packets)
	
	// Update packets when data changes
	$effect(() => {
		packets = data.packets
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
</script>

<svelte:head>
	<title>Packets - Rowera CMS</title>
	<meta name="description" content="Manage your packets, pieces, and shared presets" />
</svelte:head>

<PacketsNavigation activeRoute="/packets" />

<CrudTable 
	items={packets}
	columns={packetColumns}
	title="Packets"
	createUrl="/packets/new"
	editUrl={(item) => `/packets/${item.id}/edit`}
	onDelete={handleDeletePacket}
/>

