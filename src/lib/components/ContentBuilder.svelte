<script>
	let {
		contentItems = [],
		primitives = [],
		partials = [],
		contentData = $bindable([]),
		label = 'Content'
	} = $props()

	// Build content structure from items
	$effect(() => {
		if (contentItems.length > 0 && contentData.length === 0) {
			contentData = contentItems.map((item, index) => {
				if (item.type === 'primitive') {
					const primitive = primitives.find(p => p.id === item.primitiveId || p.id === item.id)
					return {
						order: index,
						primitiveId: item.primitiveId || item.id,
						sourcePresetId: item.sourcePresetId || null,
						sourcePartialId: null,
						content: primitive?.fields?.reduce((acc, field) => {
							acc[field.name] = ''
							return acc
						}, {}) || {}
					}
				} else {
					// For partials, we need to get the primitives within the partial
					const partial = partials.find(p => p.id === item.partialId || p.id === item.id)
					return {
						order: index,
						primitiveId: null,
						sourcePresetId: null,
						sourcePartialId: item.partialId || item.id,
						content: {},
						// Store partial info for rendering
						_partialName: partial?.name || '',
						_partialPrimitives: partial?.primitives || []
					}
				}
			})
		}
	})

	function getPrimitive(primitiveId) {
		return primitives.find(p => p.id === primitiveId)
	}

	function getPartial(partialId) {
		return partials.find(p => p.id === partialId)
	}

	function renderField(field, contentItem) {
		const value = contentItem.content[field.name] || ''

		switch (field.type) {
			case 'textarea':
				return `<textarea
					id="${field.name}"
					bind:value={contentItem.content['${field.name}']}
					placeholder="${field.placeholder || ''}"
					${field.optional ? '' : 'required'}
				></textarea>`
			case 'number':
				return `<input
					type="number"
					id="${field.name}"
					bind:value={contentItem.content['${field.name}']}
					placeholder="${field.placeholder || ''}"
					${field.optional ? '' : 'required'}
				/>`
			case 'email':
			case 'url':
			case 'tel':
				return `<input
					type="${field.type}"
					id="${field.name}"
					bind:value={contentItem.content['${field.name}']}
					placeholder="${field.placeholder || ''}"
					${field.optional ? '' : 'required'}
				/>`
			default:
				return `<input
					type="text"
					id="${field.name}"
					bind:value={contentItem.content['${field.name}']}
					placeholder="${field.placeholder || ''}"
					${field.optional ? '' : 'required'}
				/>`
		}
	}
</script>

<section class="content-builder">
	<h3>{label}</h3>

	{#if contentData.length === 0}
		<p class="no-content">No content items to configure. Add primitives or partials to the preset first.</p>
	{:else}
		{#each contentData as contentItem, index}
			{#if contentItem.primitiveId}
				{@const primitive = getPrimitive(contentItem.primitiveId)}
				{#if primitive}
					<article class="content-item">
						<h4>{primitive.name}</h4>
						{#if primitive.description}
							<p class="description">{primitive.description}</p>
						{/if}

						{#if primitive.fields && primitive.fields.length > 0}
							{#each primitive.fields as field}
								<div class="form-group">
									<label for={field.name}>
										{field.label}
										{#if field.optional}
											<span class="optional">(optional)</span>
										{/if}
									</label>
									{#if field.description}
										<p class="field-description">{field.description}</p>
									{/if}
									{#if field.type === 'textarea'}
										<textarea
											id={field.name}
											bind:value={contentItem.content[field.name]}
											placeholder={field.placeholder || ''}
											required={!field.optional}
										></textarea>
									{:else if field.type === 'number'}
										<input
											type="number"
											id={field.name}
											bind:value={contentItem.content[field.name]}
											placeholder={field.placeholder || ''}
											required={!field.optional}
										/>
									{:else if ['email', 'url', 'tel'].includes(field.type)}
										<input
											type={field.type}
											id={field.name}
											bind:value={contentItem.content[field.name]}
											placeholder={field.placeholder || ''}
											required={!field.optional}
										/>
									{:else}
										<input
											type="text"
											id={field.name}
											bind:value={contentItem.content[field.name]}
											placeholder={field.placeholder || ''}
											required={!field.optional}
										/>
									{/if}
								</div>
							{/each}
						{/if}
					</article>
				{/if}
			{:else if contentItem.sourcePartialId}
				{@const partial = getPartial(contentItem.sourcePartialId)}
				{#if partial}
					<article class="content-item partial-item">
						<h4>
							<span class="partial-badge">Partial</span>
							{partial.name}
						</h4>
						{#if partial.description}
							<p class="description">{partial.description}</p>
						{/if}
						<p class="partial-info">This partial contains predefined content and doesn't require additional input.</p>
					</article>
				{/if}
			{/if}
		{/each}
	{/if}
</section>

<style>
	.content-builder {
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.no-content {
		color: var(--tertiary-color);
		font-style: italic;
		margin: 0;
	}

	.content-item {
		background: var(--surface-color);
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		padding: 1.5rem;
		margin-bottom: 1rem;
	}

	.content-item:last-child {
		margin-bottom: 0;
	}

	.content-item h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: var(--primary-color);
	}

	.description {
		color: var(--secondary-color);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group:last-child {
		margin-bottom: 0;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
	}

	.optional {
		font-weight: normal;
		color: var(--tertiary-color);
		font-size: 0.9rem;
	}

	.field-description {
		font-size: 0.85rem;
		color: var(--secondary-color);
		margin-top: 0.25rem;
		margin-bottom: 0.5rem;
	}

	input, textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		font-size: 1rem;
		background: var(--base-color);
	}

	input:focus, textarea:focus {
		outline: 0;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 0.2rem var(--accent-tertiary-color);
	}

	textarea {
		min-height: 100px;
		resize: vertical;
	}

	.partial-item {
		background: var(--base-color);
		border-color: var(--tertiary-color);
	}

	.partial-badge {
		display: inline-block;
		background: var(--tertiary-color);
		color: var(--base-color);
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		font-size: 0.75rem;
		margin-right: 0.5rem;
		text-transform: uppercase;
		font-weight: 600;
	}

	.partial-info {
		color: var(--secondary-color);
		font-size: 0.9rem;
		margin: 0;
		font-style: italic;
	}
</style>
