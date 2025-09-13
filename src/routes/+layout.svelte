<script>
	let { children } = $props()
</script>

<div class="admin-layout">
	<nav class="sidebar">
		<header>
			<h1>Rowera</h1>
		</header>
		
		<ul class="nav-menu">
			<li><a href="/">Home</a></li>
			<li><a href="/posts">Posts</a></li>
			<li><a href="/pages">Pages</a></li>
			<li><a href="/partials">Partials</a></li>
			<li><a href="/presentation">Presentation</a></li>
			<li><a href="/preferences">Preferences</a></li>
			<li><a href="/profile">Profile</a></li>
		</ul>
	</nav>
	
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.admin-layout {
		display: grid;
		grid-template-columns: 250px 1fr;
		height: 100vh;
	}
	
	.sidebar {
		background: #f8f9fa;
		border-right: 1px solid #e9ecef;
		padding: 1.5rem;
	}
	
	.sidebar header h1 {
		margin: 0 0 2rem 0;
		font-size: 1.5rem;
		color: #495057;
	}
	
	.nav-menu {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.nav-menu li {
		margin-bottom: 0.5rem;
	}
	
	.nav-menu a {
		display: block;
		padding: 0.75rem 1rem;
		color: #6c757d;
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.2s ease;
	}
	
	.nav-menu a:hover {
		background: #e9ecef;
		color: #495057;
	}
	
	.content {
		padding: 2rem;
		overflow-y: auto;
	}
</style>