<script>
	// This will eventually load from the database
	let user = {
		name: 'John Doe',
		email: 'john@example.com',
		avatar: null,
		createdAt: new Date().toISOString(),
		stats: {
			postsCount: 0,
			pagesCount: 0,
			partialsCount: 0
		}
	}
	
	let isEditing = false
	let passwordData = {
		current: '',
		new: '',
		confirm: ''
	}
</script>

<header class="page-header">
	<h1>Profile</h1>
</header>

<div class="profile-grid">
	<section class="profile-info">
		<header class="section-header">
			<h2>Profile Information</h2>
			<button 
				class="btn btn-secondary btn-sm" 
				onclick={() => isEditing = !isEditing}
			>
				{isEditing ? 'Cancel' : 'Edit'}
			</button>
		</header>
		
		<div class="avatar-section">
			{#if user.avatar}
				<img src={user.avatar} alt={user.name} class="avatar">
			{:else}
				<div class="avatar-placeholder">
					{user.name.charAt(0).toUpperCase()}
				</div>
			{/if}
			
			{#if isEditing}
				<button class="btn btn-secondary btn-sm">Change Avatar</button>
			{/if}
		</div>
		
		<form class="profile-form">
			<div class="form-group">
				<label for="name">Name</label>
				<input 
					id="name" 
					type="text" 
					bind:value={user.name} 
					disabled={!isEditing}
				>
			</div>
			
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					id="email" 
					type="email" 
					bind:value={user.email} 
					disabled={!isEditing}
				>
			</div>
			
			{#if isEditing}
				<div class="form-actions">
					<button type="submit" class="btn btn-primary">Save Changes</button>
				</div>
			{/if}
		</form>
	</section>
	
	<section class="profile-stats">
		<h2>Your Content</h2>
		
		<div class="stats-grid">
			<div class="stat-item">
				<span class="stat-number">{user.stats.postsCount}</span>
				<span class="stat-label">Posts</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-number">{user.stats.pagesCount}</span>
				<span class="stat-label">Pages</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-number">{user.stats.partialsCount}</span>
				<span class="stat-label">Partials</span>
			</div>
		</div>
		
		<p class="member-since">
			Member since {new Date(user.createdAt).toLocaleDateString()}
		</p>
	</section>
	
	<section class="password-section">
		<h2>Change Password</h2>
		
		<form class="password-form">
			<div class="form-group">
				<label for="current-password">Current Password</label>
				<input 
					id="current-password" 
					type="password" 
					bind:value={passwordData.current}
					placeholder="Enter current password"
				>
			</div>
			
			<div class="form-group">
				<label for="new-password">New Password</label>
				<input 
					id="new-password" 
					type="password" 
					bind:value={passwordData.new}
					placeholder="Enter new password"
				>
			</div>
			
			<div class="form-group">
				<label for="confirm-password">Confirm New Password</label>
				<input 
					id="confirm-password" 
					type="password" 
					bind:value={passwordData.confirm}
					placeholder="Confirm new password"
				>
			</div>
			
			<div class="form-actions">
				<button type="submit" class="btn btn-primary">Update Password</button>
			</div>
		</form>
	</section>
</div>

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
	
	.profile-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		grid-template-areas: 
			"info stats"
			"password password";
	}
	
	@media (max-width: 768px) {
		.profile-grid {
			grid-template-columns: 1fr;
			grid-template-areas: 
				"info"
				"stats"
				"password";
		}
	}
	
	.profile-info {
		grid-area: info;
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		padding: 2rem;
	}
	
	.profile-stats {
		grid-area: stats;
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		padding: 2rem;
	}
	
	.password-section {
		grid-area: password;
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		padding: 2rem;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	
	.section-header h2 {
		margin: 0;
		color: #495057;
	}
	
	h2 {
		margin: 0 0 1.5rem 0;
		color: #495057;
	}
	
	.avatar-section {
		text-align: center;
		margin-bottom: 2rem;
	}
	
	.avatar, .avatar-placeholder {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-bottom: 1rem;
	}
	
	.avatar {
		object-fit: cover;
	}
	
	.avatar-placeholder {
		background: #6c757d;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
		margin: 0 auto 1rem;
	}
	
	.form-group {
		margin-bottom: 1.5rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #495057;
		font-weight: 500;
	}
	
	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-size: 0.9rem;
		transition: border-color 0.2s ease;
	}
	
	input:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
	}
	
	input:disabled {
		background: #f8f9fa;
		color: #6c757d;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 2rem;
	}
	
	.stat-item {
		text-align: center;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 4px;
	}
	
	.stat-number {
		display: block;
		font-size: 2rem;
		font-weight: bold;
		color: #495057;
	}
	
	.stat-label {
		color: #6c757d;
		font-size: 0.9rem;
	}
	
	.member-since {
		color: #6c757d;
		font-size: 0.9rem;
		margin: 0;
	}
	
	.form-actions {
		margin-top: 1.5rem;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
		display: inline-block;
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
	
	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.8rem;
	}
</style>