<script>
	let { 
		items = [], 
		columns = [], 
		title, 
		createLabel = 'Create New',
		createUrl,
		editUrl = (item) => `/${item.id}/edit`,
		onDelete
	} = $props()
</script>

<header class="page-header">
	<h1>{title}</h1>
	<nav class="header-actions">
		<a href={createUrl} class="btn btn-primary">{createLabel}</a>
	</nav>
</header>

{#if items.length === 0}
	<section class="empty-state">
		<h2>No {title.toLowerCase()} yet</h2>
		<p>Get started by creating your first {title.toLowerCase().slice(0, -1)}.</p>
		<nav class="empty-actions">
			<a href={createUrl} class="btn btn-primary">Create First {title.slice(0, -1)}</a>
		</nav>
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
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
	
	.header-actions {
		display: flex;
		gap: 1rem;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: all 0.2s ease;
		border: none;
		cursor: pointer;
		display: inline-block;
		text-align: center;
	}
	
	.btn-small {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}
	
	.btn-primary {
		background: #007bff;
		color: white;
	}
	
	.btn-primary:hover {
		background: #0056b3;
	}
	
	.btn-secondary {
		background: #6c757d;
		color: white;
	}
	
	.btn-secondary:hover {
		background: #545b62;
	}
	
	.btn-danger {
		background: #dc3545;
		color: white;
	}
	
	.btn-danger:hover {
		background: #c82333;
	}
	
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}
	
	.empty-state h2 {
		margin-bottom: 1rem;
		color: #495057;
	}
	
	.empty-state p {
		color: #6c757d;
		margin-bottom: 2rem;
	}
	
	.empty-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	
	.items-table {
		background: white;
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
		background: #f8f9fa;
		font-weight: 600;
		color: #495057;
	}
	
	tbody tr:hover {
		background: #f8f9fa;
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