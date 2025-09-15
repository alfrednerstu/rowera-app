<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
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
			const response = await fetch('/api/partials', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
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
/>