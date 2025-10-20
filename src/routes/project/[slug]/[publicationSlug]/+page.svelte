<script>
	let { data } = $props()
</script>

<article>
	<h1>{data.publication.name}</h1>

	{#if data.posts.length > 0}
		<section>
			<ul>
				{#each data.posts as post}
					<li>
						<a href="/{data.publication.slug}/{post.slug}">
							<h2>{post.title}</h2>
							{#if post.publishedAt}
								<time datetime={post.publishedAt.toISOString()}>
									{post.publishedAt.toLocaleDateString()}
								</time>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<p>No posts published yet.</p>
	{/if}
</article>
