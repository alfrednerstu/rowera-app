<script>
	import PrimitiveRenderer from '$lib/components/PrimitiveRenderer.svelte'
	let { data } = $props()
</script>

{#if data.type === 'piece'}
	<article>
		<header>
			<h1>{data.piece.name}</h1>
		</header>

		{#if data.content.length > 0}
			<PrimitiveRenderer content={data.content} startingHeadingLevel={2} />
		{:else}
			<p>No content available.</p>
		{/if}
	</article>

	<nav>
		<a href="/project/{data.project.id}/{data.packet.slug}">← Back to {data.packet.name}</a>
	</nav>
{:else if data.type === 'post'}
	<article>
		<header>
			<h1>{data.post.title}</h1>
			{#if data.post.publishedAt}
				<time datetime={data.post.publishedAt.toISOString()}>
					{data.post.publishedAt.toLocaleDateString()}
				</time>
			{/if}
		</header>

		{#if data.content.length > 0}
			<PrimitiveRenderer content={data.content} startingHeadingLevel={2} />
		{:else}
			<p>No content available.</p>
		{/if}
	</article>

	<nav>
		<a href="/project/{data.project.id}/{data.publication.slug}">← Back to {data.publication.name}</a>
	</nav>
{/if}
