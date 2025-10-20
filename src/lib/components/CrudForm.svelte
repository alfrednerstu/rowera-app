<script>
	let {
		title,
		fields = [],
		item = {},
		submitLabel = 'Save',
		cancelUrl = '/',
		onSubmit,
		children
	} = $props()

	let formData = $state({ ...item })

	function handleSubmit(event) {
		event.preventDefault()
		onSubmit?.(formData)
	}
</script>

<header class="page-header">
	<h1>{title}</h1>
	<nav class="header-actions">
		<button><a href={cancelUrl}>Cancel</a></button>
	</nav>
</header>

<section class="form-container">
	<form onsubmit={handleSubmit}>
		{#each fields as field}
			<div class="form-group">
				<label for={field.name}>{field.label}</label>
				{#if field.type === 'textarea'}
					<textarea
						id={field.name}
						bind:value={formData[field.name]}
						placeholder={field.placeholder}
						required={field.required}
					></textarea>
				{:else if field.type === 'select'}
					<select
						id={field.name}
						bind:value={formData[field.name]}
						required={field.required}
					>
						<option value="">Select {field.label}</option>
						{#each field.options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				{:else}
					<input
						id={field.name}
						type={field.type || 'text'}
						bind:value={formData[field.name]}
						placeholder={field.placeholder}
						required={field.required}
					/>
				{/if}
			</div>
		{/each}

		{#if children}
			{@render children()}
		{/if}

		<div class="form-actions">
			<button type="submit">{submitLabel}</button>
			<button><a href={cancelUrl}>Cancel</a></button>
		</div>
	</form>
</section>

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
	}

	.form-container {
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		padding: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	input, textarea, select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
		background: var(--base-color);
	}

	input:focus, textarea:focus, select:focus {
		outline: 0;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 0.2rem var(--accent-tertiary-color);
	}

	textarea {
		min-height: 120px;
		resize: vertical;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--quad-color);
	}
</style>