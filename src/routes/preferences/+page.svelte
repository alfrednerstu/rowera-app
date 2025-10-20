<script>
	// This will eventually load from the database/settings
	let preferences = {
		siteName: 'My Rowera Site',
		siteUrl: 'https://example.com',
		defaultFeed: null,
		allowPublicAccess: true,
		enableComments: false,
		autoSave: true,
		defaultElementTemplates: true
	}
	
	let feeds = []
</script>

<header class="page-header">
	<h1>Preferences</h1>
</header>

<form class="preferences-form">
	<section class="form-section">
		<h2>Site Settings</h2>
		
		<div class="form-group">
			<label for="site-name">Site Name</label>
			<input 
				id="site-name" 
				type="text" 
				bind:value={preferences.siteName} 
				placeholder="Enter your site name"
			>
		</div>
		
		<div class="form-group">
			<label for="site-url">Site URL</label>
			<input 
				id="site-url" 
				type="url" 
				bind:value={preferences.siteUrl} 
				placeholder="https://example.com"
			>
		</div>
		
		<div class="form-group">
			<label for="default-feed">Default Feed</label>
			<select id="default-feed" bind:value={preferences.defaultFeed}>
				<option value={null}>No default feed</option>
				{#each feeds as feed}
					<option value={feed.id}>{feed.name}</option>
				{/each}
			</select>
		</div>
	</section>
	
	<section class="form-section">
		<h2>Content Settings</h2>
		
		<div class="form-group checkbox-group">
			<label>
				<input 
					type="checkbox" 
					bind:checked={preferences.allowPublicAccess}
				>
				Allow public access to published content
			</label>
		</div>
		
		<div class="form-group checkbox-group">
			<label>
				<input 
					type="checkbox" 
					bind:checked={preferences.enableComments}
				>
				Enable comments on posts
			</label>
		</div>
	</section>
	
	<section class="form-section">
		<h2>Editor Settings</h2>
		
		<div class="form-group checkbox-group">
			<label>
				<input 
					type="checkbox" 
					bind:checked={preferences.autoSave}
				>
				Auto-save content while editing
			</label>
		</div>
		
		<div class="form-group checkbox-group">
			<label>
				<input 
					type="checkbox" 
					bind:checked={preferences.defaultElementTemplates}
				>
				Include default element templates
			</label>
		</div>
	</section>
	
	<footer class="form-actions">
		<button type="submit">Save Preferences</button>
		<button type="button">Reset to Defaults</button>
	</footer>
</form>

<style>
	.page-header {
		margin-bottom: 1rem;
	}

	.preferences-form {
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		padding: 2rem;
	}

	.form-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--quint-color);
	}

	.form-section:last-of-type {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.form-section h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.25rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group:last-child {
		margin-bottom: 0;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.checkbox-group label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	input[type="text"],
	input[type="url"],
	select {
		width: 100%;
		max-width: 400px;
		padding: 0.75rem;
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		font-size: 0.9rem;
		transition: border-color 0.2s ease;
		background: var(--base-color);
	}

	input[type="text"]:focus,
	input[type="url"]:focus,
	select:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 2px var(--accent-tertiary-color);
	}

	input[type="checkbox"] {
		width: auto;
		margin: 0;
	}

	.form-actions {
		padding-top: 2rem;
		border-top: 1px solid var(--quint-color);
		display: flex;
		gap: 1rem;
	}
</style>