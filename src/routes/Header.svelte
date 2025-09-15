<script lang="ts">
	import { page } from '$app/state';
	import { session, signOut } from '$lib/auth-client'
	import { onMount } from 'svelte'

	let isAdmin = $state(false)

	onMount(async () => {
		// Check if user is admin by testing admin endpoints
		if ($session.data?.user) {
			try {
				const response = await fetch('/api/primitives', { method: 'POST', body: '{}' })
				isAdmin = response.status !== 403
			} catch {
				isAdmin = false
			}
		}
	})

	async function handleLogout() {
		await signOut()
	}
</script>

{#if $session.data?.user}
<header>
	<nav>
		<section class="brand">
			<h1>Rowera</h1>
		</section>
		
		<section class="center-nav">
			<ul class="main-nav">
				<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
					<a href="/">Projects</a>
				</li>
				<li aria-current={page.url.pathname === '/posts' ? 'page' : undefined}>
					<a href="/posts">Posts</a>
				</li>
				<li aria-current={page.url.pathname === '/pages' ? 'page' : undefined}>
					<a href="/pages">Pages</a>
				</li>
				{#if isAdmin}
					<li aria-current={page.url.pathname === '/primitives' ? 'page' : undefined}>
						<a href="/primitives">Primitives</a>
					</li>
				{/if}
				<li>
					<button class="preview-btn">Preview</button>
				</li>
			</ul>
		</section>
		
		<section class="user-nav">
			<ul>
				<li aria-current={page.url.pathname === '/presentation' ? 'page' : undefined}>
					<a href="/presentation">Presentation</a>
				</li>
				<li aria-current={page.url.pathname === '/preferences' ? 'page' : undefined}>
					<a href="/preferences">Preferences</a>
				</li>
				<li aria-current={page.url.pathname === '/profile' ? 'page' : undefined}>
					<a href="/profile">Profile</a>
				</li>
			</ul>
		</section>
	</nav>
</header>
{:else}
<header>
	<nav>
		<section class="brand">
			<h1>Rowera</h1>
		</section>
		
		<section class="auth-nav">
			<ul>
				<li aria-current={page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">Login</a>
				</li>
				<li aria-current={page.url.pathname === '/signup' ? 'page' : undefined}>
					<a href="/signup">Sign Up</a>
				</li>
			</ul>
		</section>
	</nav>
</header>
{/if}

<style>
	header {
		background: #fff;
		border-bottom: 1px solid #e9ecef;
		padding: 1rem 2rem;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.brand h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: #495057;
	}

	.center-nav {
		display: flex;
		justify-content: center;
		flex-grow: 1;
	}

	.main-nav {
		display: flex;
		align-items: center;
		gap: 2rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.user-nav ul, .auth-nav ul {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.main-nav a, .user-nav a, .auth-nav a {
		color: #495057;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.main-nav a:hover, .auth-nav a:hover {
		color: #007bff;
	}

	.user-nav a {
		font-size: 0.9rem;
		font-weight: 400;
		color: #6c757d;
	}

	.user-nav a:hover {
		color: #495057;
	}

	.preview-btn {
		background: #007bff;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.preview-btn:hover {
		background: #0056b3;
	}

	li[aria-current='page'] a {
		color: #007bff;
		font-weight: 600;
	}
</style>
