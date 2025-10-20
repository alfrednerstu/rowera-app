<script lang="ts">
	import { activeProject, type Project } from '$lib/stores/active-project';
	import { session } from '$lib/auth-client';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		onSelectProject: (project: Project) => void;
		onCreateNew: () => void;
	}

	let { onSelectProject, onCreateNew }: Props = $props();

	let projects: Project[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	$effect(async () => {
		if (!$session.data?.user?.id) return;

		try {
			const response = await fetch('/api/projects');
			if (!response.ok) {
				throw new Error('Failed to fetch projects');
			}
			const data = await response.json();
			projects = data.projects || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load projects';
		} finally {
			loading = false;
		}
	});

	async function handleSelectProject(project: Project) {
		activeProject.setActive(project);
		onSelectProject(project);
		// Invalidate all cached data to refresh content for the new project
		await invalidateAll();
	}
</script>

<div class="project-selector">
	{#if loading}
		<div class="loading">Loading projects...</div>
	{:else if error}
		<div class="error">Error: {error}</div>
	{:else}
		<div class="project-list">
			{#each projects as project (project.id)}
				<button
					class="project-item"
					class:active={$activeProject.id === project.id}
					onclick={() => handleSelectProject(project)}
				>
					<div class="project-name">{project.name}</div>
					<!--Updated {new Date(project.updatedAt).toLocaleDateString()} -->
				</button>
			{/each}

			{#if projects.length === 0}
				<div class="empty-state">
					<p>No projects found</p>
					<p class="empty-subtitle">Create your first project to get started</p>
				</div>
			{/if}
		</div>

		<div class="actions">
			<button class="create-button" onclick={onCreateNew}>
				Create new project
			</button>
		</div>
	{/if}
</div>

<style>
	.project-selector {
		min-height: 200px;
	}

	.loading,
	.error {
		text-align: center;
		padding: 2rem;
		color: var(--secondary-color);
		opacity: 0.75;
	}

	.error {
		color: var(--accent-color);
	}

	.project-list {
		margin-bottom: 1.5rem;
		max-height: 300px;
		overflow-y: auto;
	}

	.project-item {
		background: var(--surface-color);
		color: var(--primary-color);
		width: 100%;
		padding: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-bottom: 0.5rem;
		text-align: left;
	}

	.project-item:hover {
		background: var(--surface-color);
	}

	.project-item.active {
		background: unset;
		color: var(--accent-color);
		
	}

	.project-name {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.project-date {
		font-size: 0.875rem;
		color: var(--secondary-color);
		opacity: 0.75;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--secondary-color);
		opacity: 0.75;
	}

	.empty-subtitle {
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}

</style>
