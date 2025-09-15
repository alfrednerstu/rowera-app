<script>
	import CrudForm from '$lib/components/CrudForm.svelte'
	import { goto } from '$app/navigation'
	
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
			const response = await fetch('/api/primitives', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})
			
			if (response.ok) {
				goto('/primitives')
			} else {
				const error = await response.json()
				alert(error.error || 'Failed to create primitive')
			}
		} catch (error) {
			console.error('Error creating primitive:', error)
			alert('Error creating primitive')
		}
	}
</script>

<svelte:head>
	<title>Create New Primitive - Rowera CMS</title>
</svelte:head>

<CrudForm
	title="Create New Primitive"
	{fields}
	submitLabel="Create Primitive"
	cancelUrl="/primitives"
	onSubmit={handleSubmit}
/>