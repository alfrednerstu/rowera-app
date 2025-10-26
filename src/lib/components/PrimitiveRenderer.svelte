<script>
	/**
	 * Smart primitive renderer that automatically handles header hierarchy
	 * and properly processes primitive tag templates
	 */
	let {
		content = [],
		startingHeadingLevel = 1
	} = $props()

	// Track heading context/depth as we render
	let headingContext = $state({ level: startingHeadingLevel, count: 0 })

	// Layout primitives that increment heading depth when nested
	const containerPrimitives = ['Section', 'Article', 'Aside', 'Nav', 'Header', 'Footer', 'Main']

	/**
	 * Process a primitive's tag template and content to generate HTML
	 */
	function renderPrimitive(item, currentHeadingLevel) {
		const { primitiveName, content: fieldValues } = item

		// Special handling for Heading primitive with automatic hierarchy
		if (primitiveName === 'Heading') {
			const text = fieldValues.text || ''
			const level = Math.min(currentHeadingLevel, 6) // Cap at h6
			headingContext.count++
			return `<h${level}>${text}</h${level}>`
		}

		// For layout containers, we'll need to handle them specially
		// to increment heading depth for their children
		if (containerPrimitives.includes(primitiveName)) {
			const content = fieldValues.content || ''
			const tagName = primitiveName.toLowerCase()
			return `<${tagName}>${content}</${tagName}>`
		}

		// Generic primitive rendering based on tag template
		// For now, handle common cases manually
		switch (primitiveName) {
			case 'Paragraph':
				return `<p>${fieldValues.content || ''}</p>`

			case 'List': {
				const variant = fieldValues.variant || 'ul'
				const item = fieldValues.item || ''
				return `<${variant}><li>${item}</li></${variant}>`
			}

			case 'Blockquote': {
				const quote = fieldValues.quote || ''
				const citation = fieldValues.citation || ''
				return `<blockquote><p>${quote}</p>${citation ? `<cite>${citation}</cite>` : ''}</blockquote>`
			}

			case 'Code':
				return `<code>${fieldValues.code || ''}</code>`

			case 'Time':
				return `<time datetime="${fieldValues.datetime || ''}">${fieldValues.display || ''}</time>`

			case 'Image': {
				const src = fieldValues.src || ''
				const alt = fieldValues.alt || ''
				const caption = fieldValues.caption || ''
				return `<figure><img src="${src}" alt="${alt}">${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
			}

			case 'Video': {
				const src = fieldValues.src || ''
				const fallback = fieldValues.fallback || ''
				return `<video src="${src}" controls>${fallback}</video>`
			}

			case 'Audio': {
				const src = fieldValues.src || ''
				const fallback = fieldValues.fallback || ''
				return `<audio src="${src}" controls>${fallback}</audio>`
			}

			case 'Button':
				return `<button>${fieldValues.text || ''}</button>`

			case 'Link':
				return `<a href="${fieldValues.href || ''}">${fieldValues.text || ''}</a>`

			case 'Accordion':
				return `<details><summary>${fieldValues.summary || ''}</summary>${fieldValues.content || ''}</details>`

			case 'Dialog':
				return `<dialog>${fieldValues.content || ''}</dialog>`

			default:
				// Fallback: render fields as divs
				return Object.entries(fieldValues)
					.map(([key, value]) => `<div data-field="${key}">${value}</div>`)
					.join('')
		}
	}

	/**
	 * Render content with automatic heading hierarchy
	 */
	function renderContent(items, currentLevel = startingHeadingLevel) {
		let html = ''

		for (const item of items) {
			if (!item.primitiveName && !item.partialName) continue

			// Determine heading level for this context
			let headingLevel = currentLevel

			// First heading in the page should be h1
			if (item.primitiveName === 'Heading' && headingContext.count === 0) {
				headingLevel = 1
			}
			// Subsequent headings at root level should be h2
			else if (item.primitiveName === 'Heading' && currentLevel === startingHeadingLevel) {
				headingLevel = headingContext.count === 0 ? 1 : 2
			}

			if (item.primitiveName) {
				const rendered = renderPrimitive(item, headingLevel)

				// If this is a container, increment level for its children
				// Note: For now, containers don't have nested content in the current data structure
				html += rendered
			} else if (item.partialName) {
				// Render partial content (preserved from original implementation)
				html += '<div data-partial="' + item.partialName + '">'
				if (item.content && typeof item.content === 'object') {
					for (const [key, value] of Object.entries(item.content)) {
						html += '<div data-field="' + key + '">'
						if (typeof value === 'string') {
							html += value
						} else {
							html += JSON.stringify(value)
						}
						html += '</div>'
					}
				}
				html += '</div>'
			}
		}

		return html
	}
</script>

<div class="primitive-content">
	{@html renderContent(content)}
</div>

<style>
	.primitive-content {
		/* Content flows naturally */
	}

	.primitive-content :global(h1),
	.primitive-content :global(h2),
	.primitive-content :global(h3),
	.primitive-content :global(h4),
	.primitive-content :global(h5),
	.primitive-content :global(h6) {
		margin-top: 1.5em;
		margin-bottom: 0.5em;
	}

	.primitive-content :global(h1) {
		font-size: 2em;
		font-weight: bold;
	}

	.primitive-content :global(h2) {
		font-size: 1.5em;
		font-weight: bold;
	}

	.primitive-content :global(h3) {
		font-size: 1.25em;
		font-weight: bold;
	}

	.primitive-content :global(p) {
		margin-bottom: 1em;
	}

	.primitive-content :global(ul),
	.primitive-content :global(ol) {
		margin-left: 1.5em;
		margin-bottom: 1em;
	}

	.primitive-content :global(blockquote) {
		margin: 1em 0;
		padding-left: 1em;
		border-left: 3px solid #ddd;
		font-style: italic;
	}

	.primitive-content :global(figure) {
		margin: 1em 0;
	}

	.primitive-content :global(img) {
		max-width: 100%;
		height: auto;
	}

	.primitive-content :global(code) {
		background: #f4f4f4;
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-family: monospace;
	}
</style>
