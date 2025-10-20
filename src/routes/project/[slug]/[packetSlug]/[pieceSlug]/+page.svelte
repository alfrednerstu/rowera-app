<script>
	let { data } = $props()
</script>

<article>
	<header>
		<h1>{data.piece.name}</h1>
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
	<a href="/{data.packet.slug}">← Back to {data.packet.name}</a>
</nav>
