<script>
	let { data } = $props()
</script>

{#if data.page}
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
{/if}
