<script lang="ts">
	import { signUp } from '$lib/auth-client'
	import { goto } from '$app/navigation'

	let username = ''
	let email = ''
	let password = ''
	let error = ''
	let loading = false

	async function handleSignup() {
		if (!username || !email || !password) {
			error = 'Please fill in all fields'
			return
		}

		loading = true
		error = ''

		try {
			const result = await signUp.email({
				email,
				name: username,
				password,
				username,
			})

			if (result.error) {
				error = result.error.message || 'Signup failed'
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
	<title>Sign Up</title>
</svelte:head>

<main>
	<h1>Sign Up</h1>

	<form onsubmit={handleSignup}>
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
			<label for="email">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
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
			{loading ? 'Creating account...' : 'Sign Up'}
		</button>
	</form>

	<p>
		Already have an account? <a href="/login">Login</a>
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