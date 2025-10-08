<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import PrimitiveBuilder from '$lib/components/PrimitiveBuilder.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	let primitives = $state(data.preset.primitives || [])

	const fields = [
		{
			name: 'name',
			label: 'Preset Name',
			type: 'text',
			placeholder: 'Enter preset name',
			required: true
		},
		{
			name: 'publicationId',
			label: 'Publication',
			type: 'select',
			required: true,
			options: data.publications.map(publication => ({
				value: publication.id,
				label: publication.name
			}))
		}
	]

	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/presets/${data.preset.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					primitives
				})
			})

			if (response.ok) {
				goto('/posts')
			} else {
				console.error('Failed to update preset')
			}
		} catch (error) {
			console.error('Error updating preset:', error)
		}
	}
</script>

<CrudForm
	title="Edit Preset"
	{fields}
	item={data.preset}
	submitLabel="Update Preset"
	cancelUrl="/posts"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		<PrimitiveBuilder bind:primitives availablePrimitives={data.primitives} />
	{/snippet}
</CrudForm>