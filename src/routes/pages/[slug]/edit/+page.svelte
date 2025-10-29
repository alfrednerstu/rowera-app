<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import ContentEditor from '$lib/components/ContentEditor.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	let primitives = $state(data.page.primitives || [])

	// Track if slug was manually edited
	let slugManuallyEdited = $state(false)
	let titleFieldValue = $state(data.page.title || '')
	let slugFieldValue = $state(data.page.slug || '')

	// Generate slug from title
	function generateSlug(text) {
		return text
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
	}

	// Auto-update slug when title changes (if not manually edited)
	$effect(() => {
		const generatedSlug = generateSlug(titleFieldValue)
		if (!slugManuallyEdited && generatedSlug !== slugFieldValue) {
			slugFieldValue = generatedSlug
		}
	})

	// Check if slug matches generated version to determine if it's been manually edited
	function handleSlugInput(e) {
		slugFieldValue = e.target.value
		const generatedSlug = generateSlug(titleFieldValue)
		// Normalize both for comparison (case-insensitive, spaces to dashes)
		const normalizedSlug = slugFieldValue.toLowerCase().replace(/\s+/g, '-')
		slugManuallyEdited = normalizedSlug !== generatedSlug
	}

	const fields = [
		{
			name: 'title',
			label: 'Page Name',
			type: 'text',
			placeholder: 'Enter page name',
			required: true
		},
		{
			name: 'slug',
			label: 'Slug',
			type: 'text',
			placeholder: 'page-url-slug',
			required: true,
			onInput: handleSlugInput
		},
		{
			name: 'plateId',
			label: 'Plate',
			type: 'select',
			options: [
				{ value: '', label: 'No Plate (Content Only)' },
				...data.plates.map(p => ({ value: p.id, label: p.name }))
			]
		}
	]

	// Keep formData in sync with our tracked values
	$effect(() => {
		data.page.title = titleFieldValue
		data.page.slug = slugFieldValue
	})

	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/pages/${data.page.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					title: titleFieldValue,
					slug: slugFieldValue,
					primitives
				})
			})

			if (response.ok) {
				goto('/pages')
			} else {
				console.error('Failed to update page')
			}
		} catch (error) {
			console.error('Error updating page:', error)
		}
	}
</script>

<CrudForm
	title="Edit Page"
	{fields}
	item={{ title: titleFieldValue, slug: slugFieldValue, plateId: data.page.plateId || '' }}
	submitLabel="Update Page"
	cancelUrl="/pages"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		<ContentEditor bind:primitives availablePrimitives={data.primitives} mode="full" />
	{/snippet}
</CrudForm>