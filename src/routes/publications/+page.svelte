<script>
	import CrudTable from '$lib/components/CrudTable.svelte'

	let { data } = $props()
	let publications = $state(data.publications)

	// Update data when props change
	$effect(() => {
		publications = data.publications
	})

	// Publications table configuration
	const publicationColumns = [
		{ key: 'name', header: 'Name', microformatClass: 'p-name' },
		{ key: 'slug', header: 'Slug', microformatClass: 'u-url' },
		{
			key: 'createdAt',
			header: 'Created',
			microformatClass: 'dt-published',
			render: (item) => {
				const date = new Date(item.createdAt)
				return `<time datetime="${date.toISOString()}">${date.toLocaleDateString()}</time>`
			}
		}
	]

	async function handleDeletePublication(publication) {
		if (confirm(`Are you sure you want to delete "${publication.name}"?`)) {
			try {
				const response = await fetch(`/api/publications/${publication.id}`, {
					method: 'DELETE'
				})

				if (response.ok) {
					// Remove from local state without page reload
					publications = publications.filter(p => p.id !== publication.id)
				} else {
					console.error('Failed to delete publication')
				}
			} catch (error) {
				console.error('Error deleting publication:', error)
			}
		}
	}
</script>

<CrudTable
	items={publications}
	columns={publicationColumns}
	title="Publications"
	createUrl="/publications/new"
	editUrl={(item) => `/publications/${item.slug}/edit`}
	onDelete={handleDeletePublication}
	microformat="h-feed"
/>
