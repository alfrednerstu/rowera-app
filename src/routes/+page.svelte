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
	
	function getTimeBasedGreeting(): string {
		const now = new Date()
		const hour = now.getHours()
		const minute = now.getMinutes()
		const time = hour + minute / 60
		
		if (time >= 4.5 && time < 10.5) {
			return 'Good morning'
		} else if (time >= 10.5 && time < 13.5) {
			return 'Good day'
		} else if (time >= 13.5 && time < 18) {
			return 'Good afternoon'
		} else if (time >= 18 && time < 22.5) {
			return 'Good evening'
		} else {
			return 'Good night'
		}
	}
	
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
		<h1>{getTimeBasedGreeting()} <span>{$session.data?.user.username}</span></h1>

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