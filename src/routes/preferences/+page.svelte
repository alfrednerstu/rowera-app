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
		<button type="submit" class="btn btn-primary">Save Preferences</button>
		<button type="button" class="btn btn-secondary">Reset to Defaults</button>
	</footer>
</form>

<style>
	.page-header {
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
	
	.preferences-form {
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		padding: 2rem;
	}
	
	.form-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #f8f9fa;
	}
	
	.form-section:last-of-type {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
	
	.form-section h2 {
		margin: 0 0 1.5rem 0;
		color: #495057;
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
		color: #495057;
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
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-size: 0.9rem;
		transition: border-color 0.2s ease;
	}
	
	input[type="text"]:focus, 
	input[type="url"]:focus, 
	select:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
	}
	
	input[type="checkbox"] {
		width: auto;
		margin: 0;
	}
	
	.form-actions {
		padding-top: 2rem;
		border-top: 1px solid #f8f9fa;
		display: flex;
		gap: 1rem;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
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
</style>