<script>
	let { data } = $props()
</script>

{#if data.type === 'packet'}
	<article>
		<h1>{data.packet.name}</h1>

		{#if data.pieces.length > 0}
			<section>
				<ul>
					{#each data.pieces as piece}
						<li>
							<a href="/project/{data.project.id}/{data.packet.slug}/{piece.slug}">
								<h2>{piece.name}</h2>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{:else}
			<p>No pieces available yet.</p>
		{/if}
	</article>
{:else if data.type === 'page'}
	<article>
		<header>
			<h1>{data.page.title}</h1>
			{#if data.page.publishedAt}
				<time datetime={data.page.publishedAt.toISOString()}>
					{data.page.publishedAt.toLocaleDateString()}
				</time>
			{/if}
		</header>

		{#if data.content.length > 0}
			{#each data.content as item}
				<section>
					{#if item.primitiveName}
						<!-- Render primitive content -->
						<div data-primitive={item.primitiveName}>
							{#if item.content && typeof item.content === 'object'}
								{#each Object.entries(item.content) as [key, value]}
									<div data-field={key}>
										{#if typeof value === 'string'}
											{@html value}
										{:else}
											{JSON.stringify(value)}
										{/if}
									</div>
								{/each}
							{/if}
						</div>
					{:else if item.partialName}
						<!-- Render partial content -->
						<div data-partial={item.partialName}>
							{#if item.content && typeof item.content === 'object'}
								{#each Object.entries(item.content) as [key, value]}
									<div data-field={key}>
										{#if typeof value === 'string'}
											{@html value}
										{:else}
											{JSON.stringify(value)}
										{/if}
									</div>
								{/each}
							{/if}
						</div>
					{/if}
				</section>
			{/each}
		{:else}
			<p>No content available.</p>
		{/if}
	</article>
{:else if data.type === 'publication'}
	<article>
		<h1>{data.publication.name}</h1>

		{#if data.posts.length > 0}
			<section>
				<ul>
					{#each data.posts as post}
						<li>
							<a href="/project/{data.project.id}/{data.publication.slug}/{post.slug}">
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
{/if}
