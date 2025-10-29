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

	// Major container primitives that create new sections (and reset to base nesting level)
	const majorContainers = ['Section', 'Article', 'Main', 'Nav', 'Header', 'Footer']

	// Aside is special - it nests within current context without resetting
	const nestingContainers = ['Aside']

	// All layout containers
	const containerPrimitives = [...majorContainers, ...nestingContainers]

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
	 * Render content with automatic heading hierarchy based on container nesting
	 *
	 * In a flat content list, containers create "scopes":
	 * - Major containers (Section, Article, Main, etc.) mark new sibling sections
	 * - Headings after a major container are nested one level deeper
	 * - Aside nests deeper without resetting the scope
	 *
	 * Example:
	 *   Heading "Title" → h1
	 *   Section → starts nesting scope
	 *   Heading "Features" → h2 (nested in section)
	 *   Heading "Details" → h2 (still in section, sibling to Features)
	 *   Section → new sibling section (same nesting level)
	 *   Heading "Pricing" → h2 (nested in this section)
	 *   Aside → deeper nesting
	 *   Heading "Note" → h3 (nested in aside, which is in section)
	 */
	function renderContent(items) {
		let html = ''
		let nestingDepth = 0 // Track how deep we are in containers
		let inMajorContainer = false // Are we inside a major container scope?
		let inAside = false // Track if we're in an Aside

		for (const item of items) {
			if (!item.primitiveName && !item.partialName) continue

			const primitiveName = item.primitiveName

			// Handle major containers - they mark section boundaries and reset depth
			if (majorContainers.includes(primitiveName)) {
				// Major containers create a new section at depth 1
				nestingDepth = 1
				inMajorContainer = true
				inAside = false // Exiting any previous Aside
			}

			// Handle nesting containers (like Aside) - they nest deeper
			else if (nestingContainers.includes(primitiveName)) {
				// Aside nests one level deeper than current context
				if (inMajorContainer && !inAside) {
					nestingDepth = 2
					inAside = true
				} else if (!inMajorContainer) {
					// Aside at root level
					nestingDepth = 1
					inAside = true
				}
				// Multiple Asides in a row stay at the same depth (siblings)
			}

			// Calculate heading level based on nesting depth
			let headingLevel = startingHeadingLevel + nestingDepth

			// Special case: first heading in entire document
			if (primitiveName === 'Heading' && headingContext.count === 0) {
				headingLevel = startingHeadingLevel
			}

			// Cap at h6 for accessibility
			headingLevel = Math.min(headingLevel, 6)

			// Render the primitive with the calculated heading level
			if (item.primitiveName) {
				const rendered = renderPrimitive(item, headingLevel)
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
