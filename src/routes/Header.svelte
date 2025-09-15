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
		<section>
			<h1><a href='/'>Rowera</a></h1>
		</section>
		
		<section>
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
					<button>Preview</button>
				</li>
			</ul>
		</section>
		
		<section>
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
		<section>
			<h1><a href='/'>Rowera</a></h1>
		</section>
		
		<section>
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

	h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: #495057;
}
	
	li[aria-current='page'] a {
		color: #007bff;
		font-weight: 600;
	}
</style>
