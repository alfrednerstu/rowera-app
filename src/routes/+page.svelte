<script lang="ts">
	import { session, signOut } from '$lib/auth-client'
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()

	async function handleLogout() {
		await signOut()
	}
	
	const columns = [
		{ key: 'name', header: 'Name' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDelete(product) {
		if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
			try {
				const response = await fetch(`/api/products/${product.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Reload the page to refresh the products list
					window.location.reload()
				} else {
					console.error('Failed to delete product')
				}
			} catch (error) {
				console.error('Error deleting product:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Rowera CMS</title>
	<meta name="description" content="Rowera - Semantic CMS" />
</svelte:head>

<h1>Rowera CMS</h1>

<main>
	{#if $session.data?.user}
		<CrudTable 
			items={data.products}
			{columns}
			title="Products"
			createUrl="/products/new"
			editUrl={(item) => `/products/${item.id}/edit`}
			onDelete={handleDelete}
		/>
	{:else}
		<nav>
			<a href="/login">Login</a>
			<a href="/signup">Sign Up</a>
		</nav>
	{/if}
</main>