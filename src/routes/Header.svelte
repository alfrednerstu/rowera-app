<script lang="ts">
	import { page } from '$app/state';
	import { session, signOut, authClient } from '$lib/auth-client'
	import { activeProject, type Project } from '$lib/stores/active-project'
	import Overlay from '$lib/components/Overlay.svelte'
	import ProjectSelector from '$lib/components/ProjectSelector.svelte'

	let isAdmin = $state(false)
	let showProjectOverlay = $state(false)

	$effect(async () => {
		const uid = $session.data?.user?.id
		if (!uid) {
			isAdmin = false
			return
		}
		// Check permissions using Better Auth admin client
		const { data, error } = await authClient.admin.hasPermission({
			userId: uid,
			permission: { "user": ["create"] }
		})

		isAdmin = data?.success && !error
	})

	async function handleLogout() {
		await signOut()
	}

	function openProjectSelector() {
		showProjectOverlay = true
	}

	function closeProjectOverlay() {
		showProjectOverlay = false
	}

	function handleSelectProject(project: Project) {
		closeProjectOverlay()
	}

	function handleCreateNew() {
		closeProjectOverlay()
		// Navigate to create new project page
		window.location.href = '/projects/new'
	}
</script>

{#if $session.data?.user}
<header>
	<nav>
		<section>
			<h1><a href='/'>Rowera</a></h1>
			<button class="project-selector" onclick={openProjectSelector}>
				{$activeProject.name}
				<span class="chevron">▼</span>
			</button>
		</section>
		
		<section>
			<ul>				
				<li aria-current={page.url.pathname === '/projects' ? 'page' : undefined}>
					<a href="/projects">Projects</a>
				</li>
				<li aria-current={page.url.pathname === '/pages' ? 'page' : undefined}>
					<a href="/pages">Pages</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/posts') ? 'page' : undefined}>
					<a href="/posts">Posts</a>
				</li>
				<li aria-current={page.url.pathname.startsWith('/pieces') ? 'page' : undefined}>
					<a href="/pieces">Pieces</a>
				</li>
				<li aria-current={page.url.pathname === '/partials' ? 'page' : undefined}>
					<a href="/partials">Partials</a>
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

<Overlay isOpen={showProjectOverlay} onClose={closeProjectOverlay} title="Select Project">
	{#snippet children()}
		<ProjectSelector 
			onSelectProject={handleSelectProject}
			onCreateNew={handleCreateNew}
		/>
	{/snippet}
</Overlay>

<style>
	header {
		padding: 1.125rem 2rem;
	}

	h1 {
		font-family: 'Schibsted Grotesk', sans-serif;
		text-transform: uppercase;
		font-weight: 500;
		font-size: 1.5rem;
		letter-spacing: .05em;
		display: inline;
		line-height: 1;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		width: 100%;
	}

	nav > section:first-child,
	nav > section:last-child {
		flex: 1 1 0;
		min-width: 0;
	}

	nav > section:nth-child(2) {
  	flex: 0 0 auto;
  	margin-inline: auto;
  	display: flex;
  	justify-content: center;
	}

	@media (max-width: 64rem) {
  nav {
    row-gap: .75rem;
  }

  /* Put the middle section on its own row, centered */
  nav > section:nth-child(2) {
    order: 3;
    flex-basis: 100%;
    margin-inline: 0;
    justify-content: center;
  }

  /* Let side sections share the first row */
  nav > section:nth-child(1),
  nav > section:nth-child(3) {
    flex: 1 1 50%;
  }
}

	ul {
		list-style: none;
		display: flex;
		align-items: baseline;
		gap: .5rem;
		font-weight: 500;
	}

	li {
		padding: .125em .5em;
		border-radius: .25em;
		transition: all .2s ease;
		line-height: 1.5;
	}

	li:has(button) {
		padding: 0;
	}

	li:hover {
		background-color: var(--surface-color);
	}

	li:has(button):hover {
		background-color: transparent;
	}

	section:first-child span {
		position: relative;
		top: -.5em;
		left: -.25em;
		opacity: .5;
	}

	section:last-child {
		font-size: .875rem;
		opacity: .75;
	}

	section:last-child ul {
		justify-content: right;
	}

	li[aria-current='page'] a {
		color: var(--accent-color);
		font-weight: 600;
	}

	.project-selector {
		background: var(--surface-color, #f5f5f5);
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 0.375rem;
		padding: 0.5rem 0.75rem;
		margin-left: 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: all 0.2s ease;
	}

	.project-selector:hover {
		background: var(--surface-color-hover, #e5e5e5);
		border-color: var(--border-color-hover, #d5d5d5);
	}

	.chevron {
		font-size: 0.75rem;
		opacity: 0.7;
		transition: transform 0.2s ease;
	}

	.project-selector:hover .chevron {
		opacity: 1;
	}
</style>
