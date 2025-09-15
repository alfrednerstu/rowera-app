<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	const fields = [
		{
			name: 'name',
			label: 'Product Name',
			type: 'text',
			placeholder: 'Enter product name',
			required: true
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch('/api/products', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/')
			} else {
				console.error('Failed to create product')
			}
		} catch (error) {
			console.error('Error creating product:', error)
		}
	}
</script>

<CrudForm 
	title="Create Product"
	{fields}
	submitLabel="Create Product"
	cancelUrl="/"
	onSubmit={handleSubmit}
/>