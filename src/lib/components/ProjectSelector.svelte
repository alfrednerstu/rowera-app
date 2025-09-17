<script lang="ts">
	import { activeProject, type Project } from '$lib/stores/active-project'
	import { session } from '$lib/auth-client'

	interface Props {
		onSelectProject: (project: Project) => void
		onCreateNew: () => void
	}

	let { onSelectProject, onCreateNew }: Props = $props()

	let projects: Project[] = $state([])
	let loading = $state(true)
	let error = $state('')

	$effect(async () => {
		if (!$session.data?.user?.id) return
		
		try {
			const response = await fetch('/api/projects')
			if (!response.ok) {
				throw new Error('Failed to fetch projects')
			}
			const data = await response.json()
			projects = data.projects || []
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load projects'
		} finally {
			loading = false
		}
	})

	function handleSelectProject(project: Project) {
		activeProject.setActive(project)
		onSelectProject(project)
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
					<div class="project-date">
						Updated {new Date(project.updatedAt).toLocaleDateString()}
					</div>
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
				+ Create New Project
			</button>
		</div>
	{/if}
</div>

<style>
	.project-selector {
		min-height: 200px;
	}

	.loading, .error {
		text-align: center;
		padding: 2rem;
		color: var(--text-muted, #666);
	}

	.error {
		color: var(--error-color, #dc2626);
	}

	.project-list {
		margin-bottom: 1.5rem;
		max-height: 300px;
		overflow-y: auto;
	}

	.project-item {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border-color, #e5e5e5);
		border-radius: 0.375rem;
		background: var(--background-color, white);
		cursor: pointer;
		transition: all 0.2s ease;
		margin-bottom: 0.5rem;
		text-align: left;
	}

	.project-item:hover {
		background: var(--surface-color, #f9f9f9);
		border-color: var(--border-color-hover, #d5d5d5);
	}

	.project-item.active {
		background: var(--accent-color-light, #f0f9ff);
		border-color: var(--accent-color, #3b82f6);
	}

	.project-name {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.project-date {
		font-size: 0.875rem;
		color: var(--text-muted, #666);
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--text-muted, #666);
	}

	.empty-subtitle {
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}

	.actions {
		border-top: 1px solid var(--border-color, #e5e5e5);
		padding-top: 1rem;
	}

	.create-button {
		width: 100%;
		padding: 0.75rem;
		background: var(--accent-color, #3b82f6);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.create-button:hover {
		background: var(--accent-color-hover, #2563eb);
	}
</style>