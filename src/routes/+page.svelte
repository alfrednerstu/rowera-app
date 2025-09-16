<script lang="ts">
	import { session } from '$lib/auth-client'
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	
	const columns = [
		{ key: 'name', header: 'Name' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDelete(project) {
		if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
			try {
				const response = await fetch(`/api/projects/${project.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Reload the page to refresh the projects list
					window.location.reload()
				} else {
					console.error('Failed to delete project')
				}
			} catch (error) {
				console.error('Error deleting project:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Rowera – Semantic CMS</title>
	<meta name="description" content="Rowera - Semantic CMS" />
</svelte:head>
	
	{#if $session.data?.user}
		<h1>Hello <span>{$session.data?.user.username}</span></h1>

		<CrudTable 
			items={data.projects}
			{columns}
			title="Projects"
			createUrl="/projects/new"
			editUrl={(item) => `/projects/${item.id}/edit`}
			onDelete={handleDelete}
		/>
	{:else}
		<nav>
			<a href="/login">Login</a>
			<a href="/signup">Sign Up</a>
		</nav>
	{/if}

	<style>
		span {
			display: inline;
			text-transform: capitalize;
		}
	</style>