<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
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
			const response = await fetch(`/api/products/${data.product.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/')
			} else {
				console.error('Failed to update product')
			}
		} catch (error) {
			console.error('Error updating product:', error)
		}
	}
</script>

<CrudForm 
	title="Edit Product"
	{fields}
	item={data.product}
	submitLabel="Update Product"
	cancelUrl="/"
	onSubmit={handleSubmit}
/>