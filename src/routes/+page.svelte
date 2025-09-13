<script lang="ts">
	import { session, signOut } from '$lib/auth-client'

	async function handleLogout() {
		await signOut()
	}
</script>

<svelte:head>
	<title>Rowera CMS</title>
	<meta name="description" content="Rowera - Semantic CMS" />
</svelte:head>

<h1>Rowera CMS</h1>

<main>
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