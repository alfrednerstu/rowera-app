<script>
	let { 
		title,
		fields = [],
		item = {},
		submitLabel = 'Save',
		cancelUrl = '/',
		onSubmit
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
		<a href={cancelUrl} class="btn btn-secondary">Cancel</a>
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
		
		<div class="form-actions">
			<button type="submit" class="btn btn-primary">{submitLabel}</button>
			<a href={cancelUrl} class="btn btn-secondary">Cancel</a>
		</div>
	</form>
</section>

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
	
	.form-container {
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		padding: 2rem;
	}
	
	.form-group {
		margin-bottom: 1.5rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #495057;
	}
	
	input, textarea, select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
	}
	
	input:focus, textarea:focus, select:focus {
		outline: 0;
		border-color: #80bdff;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}
	
	textarea {
		min-height: 120px;
		resize: vertical;
	}
	
	.form-actions {
		display: flex;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #e9ecef;
	}
</style>