<script>
	import CrudTable from '$lib/components/CrudTable.svelte'

	let { data } = $props()
	let posts = $state(data.posts)

	// Update data when props change
	$effect(() => {
		posts = data.posts
	})

	// Posts table configuration
	const postColumns = [
		{ key: 'title', header: 'Name', microformatClass: 'p-name' },
		{ key: 'slug', header: 'Slug', microformatClass: 'u-url' },
		{ key: 'publicationName', header: 'Publication' },
		{ key: 'presetName', header: 'Preset' },
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

	async function handleDeletePost(post) {
		if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
			try {
				const response = await fetch(`/api/posts/${post.id}`, {
					method: 'DELETE'
				})

				if (response.ok) {
					// Remove from local state without page reload
					posts = posts.filter(p => p.id !== post.id)
				} else {
					console.error('Failed to delete post')
				}
			} catch (error) {
				console.error('Error deleting post:', error)
			}
		}
	}
</script>

<CrudTable
	items={posts}
	columns={postColumns}
	title="Posts"
	createUrl="/publications/posts/new"
	editUrl={(item) => `/publications/posts/${item.slug}/edit`}
	onDelete={handleDeletePost}
	microformat="h-entry"
/>
