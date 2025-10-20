<script>
	import { signOut, updateUser, changePassword } from '$lib/auth-client'

	let { data } = $props()

	let user = $state({ ...data.user })
	let originalUser = { ...data.user }

	async function handleLogout() {
		await signOut()
	}

	async function setupDefaults() {
		setupLoading = true
		setupMessage = ''
		try {
			const res = await fetch('/api/setup-defaults', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				credentials: 'include'
			})
			const data = await res.json()
			if (!res.ok) {
				setupMessage = data?.error || 'Failed to setup defaults'
				return
			}
			setupMessage = 'Defaults created'
		} catch (e) {
			setupMessage = 'Failed to setup defaults'
		} finally {
			setupLoading = false
		}
	}
	
	let isEditing = $state(false)
	let isSaving = $state(false)
	let saveMessage = $state('')
	let passwordData = $state({
		current: '',
		new: '',
		confirm: ''
	})
	let isChangingPassword = $state(false)
	let passwordMessage = $state('')
	let setupLoading = $state(false)
	let setupMessage = $state('')

	async function saveProfile(event) {
		event.preventDefault()
		isSaving = true
		saveMessage = ''

		try {
			// Update using Better Auth client for name and username
			const { data: updatedData, error } = await updateUser({
				name: user.name,
				username: user.username
			})

			if (error) {
				saveMessage = error.message || 'Failed to update profile'
				return
			}

			// Update the original user data
			originalUser = { ...user }
			isEditing = false
			saveMessage = 'Profile updated successfully'
			
			// Clear success message after 3 seconds
			setTimeout(() => {
				saveMessage = ''
			}, 3000)
		} catch (e) {
			console.error('Error updating profile:', e)
			saveMessage = 'Failed to update profile'
		} finally {
			isSaving = false
		}
	}

	function cancelEditing() {
		user = { ...originalUser }
		isEditing = false
		saveMessage = ''
	}

	async function changeUserPassword(event) {
		event.preventDefault()
		isChangingPassword = true
		passwordMessage = ''

		// Basic validation
		if (passwordData.new !== passwordData.confirm) {
			passwordMessage = 'New passwords do not match'
			isChangingPassword = false
			return
		}

		if (passwordData.new.length < 6) {
			passwordMessage = 'Password must be at least 6 characters long'
			isChangingPassword = false
			return
		}

		try {
			const { error } = await changePassword({
				currentPassword: passwordData.current,
				newPassword: passwordData.new,
				revokeOtherSessions: true
			})

			if (error) {
				passwordMessage = error.message || 'Failed to change password'
				return
			}

			// Clear password form
			passwordData = { current: '', new: '', confirm: '' }
			passwordMessage = 'Password changed successfully'
			
			// Clear success message after 3 seconds
			setTimeout(() => {
				passwordMessage = ''
			}, 3000)
		} catch (e) {
			console.error('Error changing password:', e)
			passwordMessage = 'Failed to change password'
		} finally {
			isChangingPassword = false
		}
	}
</script>

<header class="page-header">
	<h1>Profile</h1>
</header>


<div class="profile-grid">
	<section class="profile-info">
		<header class="section-header">
			<h2>Profile Information</h2>
			{#if isEditing}
				<button
					onclick={cancelEditing}
					disabled={isSaving}
				>
					Cancel
				</button>
			{:else}
				<button
					onclick={() => isEditing = true}
				>
					Edit
				</button>
			{/if}
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
				<button>Change Avatar</button>
			{/if}
		</div>
		
		<form class="profile-form" onsubmit={saveProfile}>
			<div class="form-group">
				<label for="name">Name</label>
				<input 
					id="name" 
					type="text" 
					bind:value={user.name} 
					disabled={!isEditing || isSaving}
					required
				>
			</div>
			
			<div class="form-group">
				<label for="username">Username</label>
				<input 
					id="username" 
					type="text" 
					bind:value={user.username} 
					disabled={!isEditing || isSaving}
					placeholder="Enter username"
				>
			</div>
			
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					id="email" 
					type="email" 
					value={user.email} 
					disabled
					title="Email changes are not currently supported"
				>
				<small class="help-text">Email changes are not currently supported</small>
			</div>
			
			{#if isEditing}
				<div class="form-actions">
					<button type="submit" disabled={isSaving}>
						{isSaving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			{/if}
			
			{#if saveMessage}
				<div class="message {saveMessage.includes('successfully') ? 'success' : 'error'}" aria-live="polite">
					{saveMessage}
				</div>
			{/if}
		</form>
	</section>
	
	<section class="profile-stats">
		<h2>Your Content</h2>
		
		<div class="stats-grid">
			<div class="stat-item">
				<span class="stat-number">0</span>
				<span class="stat-label">Posts</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-number">0</span>
				<span class="stat-label">Pages</span>
			</div>
			
			<div class="stat-item">
				<span class="stat-number">0</span>
				<span class="stat-label">Partials</span>
			</div>

			<button onclick={setupDefaults} disabled={setupLoading}>
				{setupLoading ? 'Setting up…' : 'Setup defaults'}
			</button>
			<button onclick={handleLogout}>
				Sign out
			</button>
			{#if setupMessage}
				<p aria-live="polite">{setupMessage}</p>
			{/if}
		</div>
		
		<p class="member-since">
			Member since {new Date(user.createdAt).toLocaleDateString()}
		</p>
		<p class="member-since">
			Last login {data.session ? new Date(data.session.updatedAt).toLocaleDateString() : 'Unknown'}
		</p>
	</section>
	
	<section class="password-section">
		<h2>Change Password</h2>
		
		<form class="password-form" onsubmit={changeUserPassword}>
			<div class="form-group">
				<label for="current-password">Current Password</label>
				<input 
					id="current-password" 
					type="password" 
					bind:value={passwordData.current}
					placeholder="Enter current password"
					disabled={isChangingPassword}
					required
				>
			</div>
			
			<div class="form-group">
				<label for="new-password">New Password</label>
				<input 
					id="new-password" 
					type="password" 
					bind:value={passwordData.new}
					placeholder="Enter new password"
					disabled={isChangingPassword}
					required
					minlength="6"
				>
			</div>
			
			<div class="form-group">
				<label for="confirm-password">Confirm New Password</label>
				<input 
					id="confirm-password" 
					type="password" 
					bind:value={passwordData.confirm}
					placeholder="Confirm new password"
					disabled={isChangingPassword}
					required
					minlength="6"
				>
			</div>
			
			<div class="form-actions">
				<button type="submit" disabled={isChangingPassword}>
					{isChangingPassword ? 'Updating...' : 'Update Password'}
				</button>
			</div>
			
			{#if passwordMessage}
				<div class="message {passwordMessage.includes('successfully') ? 'success' : 'error'}" aria-live="polite">
					{passwordMessage}
				</div>
			{/if}
		</form>
	</section>
</div>

<style>
	.page-header {
		margin-bottom: 1rem;
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
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		padding: 2rem;
	}

	.profile-stats {
		grid-area: stats;
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		padding: 2rem;
	}

	.password-section {
		grid-area: password;
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
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
	}

	h2 {
		margin: 0 0 1.5rem 0;
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
		background: var(--secondary-color);
		color: var(--base-color);
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
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--quad-color);
		border-radius: 4px;
		font-size: 0.9rem;
		transition: border-color 0.2s ease;
		background: var(--base-color);
	}

	input:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 2px var(--accent-tertiary-color);
	}

	input:disabled {
		background: var(--quint-color);
		color: var(--secondary-color);
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
		background: var(--quint-color);
		border-radius: 4px;
	}

	.stat-number {
		display: block;
		font-size: 2rem;
		font-weight: bold;
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.75;
	}

	.member-since {
		font-size: 0.9rem;
		margin: 0;
		opacity: 0.75;
	}

	.form-actions {
		margin-top: 1.5rem;
	}

	.message {
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.message.success {
		background: var(--accent-tertiary-color);
		color: var(--accent-color);
		border: 1px solid var(--accent-secondary-color);
	}

	.message.error {
		background: var(--surface-color);
		color: var(--primary-color);
		border: 1px solid var(--quad-color);
	}

	.help-text {
		font-size: 0.8rem;
		opacity: 0.75;
		margin-top: 0.25rem;
		display: block;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>