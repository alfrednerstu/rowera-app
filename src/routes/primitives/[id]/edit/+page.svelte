<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
	let { data } = $props()
	
	const fields = [
		{
			name: 'name',
			label: 'Primitive Name',
			type: 'text',
			placeholder: 'Button, Card, Modal...',
			required: true
		},
		{
			name: 'tagName',
			label: 'HTML Tag Name',
			type: 'text',
			placeholder: 'button, div, section...',
			required: true
		},
		{
			name: 'defaultContent',
			label: 'Default Content',
			type: 'textarea',
			placeholder: 'Default text content (optional)'
		},
		{
			name: 'cssStyles',
			label: 'CSS Styles',
			type: 'textarea',
			placeholder: 'color: blue; padding: 1rem; ... (optional)'
		}
	]
	
	async function handleSubmit(formData) {
		try {
			const response = await fetch(`/api/primitives/${data.primitive.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/primitives')
			} else {
				const error = await response.json()
				alert(error.error || 'Failed to update primitive')
			}
		} catch (error) {
			console.error('Error updating primitive:', error)
			alert('Error updating primitive')
		}
	}
</script>

<svelte:head>
	<title>Edit Primitive - Rowera CMS</title>
</svelte:head>

<CrudForm
	title="Edit Primitive"
	{fields}
	item={data.primitive}
	submitLabel="Update Primitive"
	cancelUrl="/primitives"
	onSubmit={handleSubmit}
/>