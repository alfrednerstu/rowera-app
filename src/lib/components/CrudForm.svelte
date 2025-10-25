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

<form onsubmit={handleSubmit}>
	{#each fields as field}
		<section class="field-box">
			<header class="field-box-header">
				<label for={field.name}>{field.label}</label>
			</header>
			<div class="field-box-content">
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
						onchange={(e) => field.onChange?.(e.target.value)}
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
						oninput={(e) => field.onInput?.(e)}
					/>
				{/if}
			</div>
		</section>
	{/each}

	{#if children}
		<section class="field-box">
			<header class="field-box-header">
				<h2>Content</h2>
			</header>
			<div class="field-box-content">
				{@render children()}
			</div>
		</section>
	{/if}

	<div class="form-actions">
		<button type="submit">{submitLabel}</button>
		<button type="button"><a href={cancelUrl}>Cancel</a></button>
	</div>
</form>

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

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field-box {
		background: var(--base-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		overflow: hidden;
	}

	.field-box-header {
		background: var(--surface-color);
		padding: 1rem;
		border-bottom: 1px solid var(--quad-color);
	}

	.field-box-header label,
	.field-box-header h2 {
		margin: 0;
		font-weight: 600;
		font-size: 1rem;
	}

	.field-box-content {
		background: var(--base-color);
		padding: 1rem;
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
	}
</style>