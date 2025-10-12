<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
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
			const response = await fetch('/api/presets', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/publications/presets')
			} else {
				console.error('Failed to create preset')
			}
		} catch (error) {
			console.error('Error creating preset:', error)
		}
	}
</script>

<CrudForm
	title="Create Preset"
	{fields}
	submitLabel="Create Preset"
	cancelUrl="/publications/presets"
	onSubmit={handleSubmit}
/>