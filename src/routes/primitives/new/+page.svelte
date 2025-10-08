<script>
	import { goto } from '$app/navigation'

	let name = $state('')
	let description = $state('')
	let tags = $state('')
	let fields = $state([])

	function addField() {
		fields = [...fields, {
			name: '',
			label: '',
			type: 'text',
			description: '',
			placeholder: '',
			optional: false,
			order: fields.length
		}]
	}

	function removeField(index) {
		fields = fields.filter((_, i) => i !== index)
		// Re-index the order
		fields.forEach((field, i) => field.order = i)
	}

	async function handleSubmit(e) {
		e.preventDefault()

		try {
			const response = await fetch('/api/primitives', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					description,
					tags,
					fields
				})
			})

			if (response.ok) {
				goto('/primitives')
			} else {
				const error = await response.json()
				alert(error.error || 'Failed to create primitive')
			}
		} catch (error) {
			console.error('Error creating primitive:', error)
			alert('Error creating primitive')
		}
	}
</script>

<svelte:head>
	<title>Create New Primitive - Rowera CMS</title>
</svelte:head>

<main>
	<h1>Create New Primitive</h1>

	<form onsubmit={handleSubmit}>
		<section>
			<label>
				Name
				<input type="text" bind:value={name} required />
			</label>

			<label>
				Description
				<textarea bind:value={description} required></textarea>
			</label>

			<label>
				HTML Tags
				<textarea bind:value={tags} required placeholder="<button>{text}</button>"></textarea>
			</label>
		</section>

		<section>
			<header>
				<h2>Fields</h2>
				<button type="button" onclick={addField}>Add Field</button>
			</header>

			{#each fields as field, index (index)}
				<article>
					<label>
						Field Name
						<input type="text" bind:value={field.name} required placeholder="src, alt, text..." />
					</label>

					<label>
						Label
						<input type="text" bind:value={field.label} required placeholder="Image URL, Alt text..." />
					</label>

					<label>
						Type
						<select bind:value={field.type}>
							<option value="text">Text</option>
							<option value="textarea">Textarea</option>
							<option value="url">URL</option>
							<option value="email">Email</option>
							<option value="number">Number</option>
						</select>
					</label>

					<label>
						Description (optional)
						<input type="text" bind:value={field.description} placeholder="Help text for this field" />
					</label>

					<label>
						Placeholder (optional)
						<input type="text" bind:value={field.placeholder} placeholder="Example text" />
					</label>

					<label>
						<input type="checkbox" bind:checked={field.optional} />
						Optional
					</label>

					<button type="button" onclick={() => removeField(index)}>Remove Field</button>
				</article>
			{/each}
		</section>

		<footer>
			<button type="submit">Create Primitive</button>
			<a href="/primitives">Cancel</a>
		</footer>
	</form>
</main>