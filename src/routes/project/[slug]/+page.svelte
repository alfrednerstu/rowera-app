<script>
	let { data } = $props()
</script>

<article>
	<h1>{data.project.name}</h1>

	{#if data.publications.length > 0}
		<section>
			<h2>Publications</h2>
			<ul>
				{#each data.publications as publication}
					<li>
						<a href="/{publication.slug}">{publication.name}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if data.packets.length > 0}
		<section>
			<h2>Packets</h2>
			<ul>
				{#each data.packets as packet}
					<li>
						<a href="/{packet.slug}">{packet.name}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</article>
