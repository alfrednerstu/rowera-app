<script lang="ts">
	import { signIn } from '$lib/auth-client'
	import { goto } from '$app/navigation'

	let username = ''
	let password = ''
	let error = ''
	let loading = false

	async function handleLogin() {
		if (!username || !password) {
			error = 'Please fill in all fields'
			return
		}

		loading = true
		error = ''

		try {
			const result = await signIn.username({
				username,
				password,
			})

			if (result.error) {
				error = result.error.message || 'Login failed'
			} else {
				goto('/')
			}
		} catch (err) {
			error = 'An unexpected error occurred'
		} finally {
			loading = false
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main>
	<h1>Login</h1>

	<form onsubmit={handleLogin}>
		<div>
			<label for="username">Username</label>
			<input
				id="username"
				type="text"
				bind:value={username}
				required
				disabled={loading}
			/>
		</div>

		<div>
			<label for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				required
				disabled={loading}
			/>
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<button type="submit" disabled={loading}>
			{loading ? 'Logging in...' : 'Login'}
		</button>
	</form>

	<p>
		Don't have an account? <a href="/signup">Sign up</a>
	</p>
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	form div {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input {
		background: var(--surface);
		padding: 0.5rem;
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	button {
		margin-top: 0.5rem;
	}
</style>