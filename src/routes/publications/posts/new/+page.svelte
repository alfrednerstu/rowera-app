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
			name: 'title',
			label: 'Post Title',
			type: 'text',
			placeholder: 'Enter post title',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'post-url-slug'
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
		},
		{
			name: 'presetId',
			label: 'Preset',
			type: 'select',
			required: true,
			options: data.presets.map(preset => ({
				value: preset.id,
				label: preset.name
			})),
			onChange: (value) => {
				selectedPresetId = value
				contentData = []
			}
		}
	]

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					content: contentData
				})
			})

			if (response.ok) {
				goto('/publications/posts')
			} else {
				console.error('Failed to create post')
			}
		} catch (error) {
			console.error('Error creating post:', error)
		}
	}
</script>

<CrudForm
	title="Create Post"
	{fields}
	submitLabel="Create Post"
	cancelUrl="/publications/posts"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		{#if contentItems.length > 0}
			<ContentBuilder
				{contentItems}
				primitives={data.primitives}
				partials={data.partials}
				bind:contentData
				label="Fill in Post Content"
			/>
		{/if}
	{/snippet}
</CrudForm>