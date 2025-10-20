<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import PrimitivePartialManager from '$lib/components/PrimitivePartialManager.svelte'
	import { goto } from '$app/navigation'

	let { data } = $props()

	const fields = [
		{
			name: 'name',
			label: 'Partial Name',
			type: 'text',
			placeholder: 'Enter partial name',
			required: true
		}
	]

	let selectedItems = $state([])

	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/partials', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					items: selectedItems
				})
			})

			if (response.ok) {
				goto('/partials')
			} else {
				console.error('Failed to create partial')
			}
		} catch (error) {
			console.error('Error creating partial:', error)
		}
	}
</script>

<CrudForm
	title="Create Partial"
	{fields}
	submitLabel="Create Partial"
	cancelUrl="/partials"
	onSubmit={handleSubmit}
>
	{#snippet children()}
		<PrimitivePartialManager
			primitives={data.primitives}
			partials={data.partials}
			bind:selectedItems
			label="Partial Components"
		/>
	{/snippet}
</CrudForm>