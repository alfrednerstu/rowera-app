<script lang="ts">
	import { session, signOut } from '$lib/auth-client'

	async function handleLogout() {
		await signOut()
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Better Auth Demo" />
</svelte:head>

<main>
	<h1>Better Auth Demo</h1>
	
	{#if $session.data?.user}
		<div>
			<p>Welcome, {$session.data.user.name}!</p>
			<p>Email: {$session.data.user.email}</p>
			<button onclick={handleLogout}>Logout</button>
		</div>
	{:else}
		<nav>
			<a href="/login">Login</a>
			<a href="/signup">Sign Up</a>
		</nav>
	{/if}
</main>
