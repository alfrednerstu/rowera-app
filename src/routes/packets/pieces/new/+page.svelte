<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import ContentBuilder from '$lib/components/ContentBuilder.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	let selectedPresetId = $state(null)
	let contentData = $state([])

	// Get selected preset and build content items
	let selectedPreset = $derived(
		data.presets.find(p => p.id === selectedPresetId)
	)

	let contentItems = $derived(
		selectedPreset?.primitives?.map((pp, index) => ({
			primitiveId: pp.primitiveId,
			sourcePresetId: selectedPresetId,
			order: index,
			type: 'primitive'
		})) || []
	)

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
			options: data.presets.map(p => ({ value: p.id, label: p.name })),
			onChange: (value) => {
				selectedPresetId = value
				contentData = []
			}
		}
	]

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/pieces', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					content: contentData
				})
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
>
	{#snippet children()}
		{#if contentItems.length > 0}
			<ContentBuilder
				{contentItems}
				primitives={data.primitives}
				partials={data.partials}
				bind:contentData
				label="Fill in Piece Content"
			/>
		{/if}
	{/snippet}
</CrudForm>