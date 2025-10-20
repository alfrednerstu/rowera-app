<script>
	let { data } = $props()
</script>

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

<nav>
	<a href="/{data.publication.slug}">← Back to {data.publication.name}</a>
</nav>
