<script>
	let { 
		items = [], 
		columns = [], 
		title, 
		createLabel = 'Create new',
		createUrl,
		editUrl = (item) => `/${item.id}/edit`,
		onDelete
	} = $props()
</script>

<header>
	<h1>{title}</h1>
	<button>
		<a href={createUrl} class="btn btn-primary">{createLabel} {title.slice(0, -1)}</a>
	</button>
</header>

{#if items.length === 0}
	<section class="empty-state">
		<h2>No {title.toLowerCase()} yet</h2>
		<p>Get started by creating your first {title.toLowerCase().slice(0, -1)}.</p>
		<button>
			<a href={createUrl} class="btn btn-primary">Create first {title.slice(0, -1)}</a>
		</button>
	</section>
{:else}
	<section class="items-table">
		<table>
			<thead>
				<tr>
					{#each columns as column}
						<th>{column.header}</th>
					{/each}
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each items as item}
					<tr>
						{#each columns as column}
							<td>
								{#if column.render}
									{@html column.render(item)}
								{:else}
									{item[column.key]}
								{/if}
							</td>
						{/each}
						<td class="actions">
							<a href={editUrl(item)} class="btn btn-small btn-secondary">Edit</a>
							<button onclick={() => onDelete?.(item)} class="btn btn-small btn-danger">Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	
	.header-actions {
		display: flex;
		gap: 1rem;
	}
	
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}
	
	.empty-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	
	.items-table {
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid #e9ecef;
		overflow: hidden;
	}
	
	table {
		width: 100%;
		border-collapse: collapse;
	}
	
	th, td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #e9ecef;
	}
	
	th {
		background: var(--surface-color);
		font-weight: 600;
	}
	
	tbody tr:hover {
		background: var(--surface-color);
	}
	
	tbody tr:last-child td {
		border-bottom: none;
	}
	
	.actions {
		white-space: nowrap;
	}
	
	.actions .btn {
		margin-right: 0.5rem;
	}
</style>