<script>
	let { data } = $props()
</script>

{#if data.packet}
	<article>
		<h1>{data.packet.name}</h1>

		{#if data.pieces.length > 0}
			<section>
				<ul>
					{#each data.pieces as piece}
						<li>
							<a href="/{data.packet.slug}/{piece.slug}">
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
{/if}
