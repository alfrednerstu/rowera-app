<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
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
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/partials/${data.partial.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/partials')
			} else {
				console.error('Failed to update partial')
			}
		} catch (error) {
			console.error('Error updating partial:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Partial"
	{fields}
	item={data.partial}
	submitLabel="Update Partial"
	cancelUrl="/partials"
	onSubmit={handleSubmit}
/>