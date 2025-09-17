import { writable } from 'svelte/store'

export interface Project {
	id: string
	name: string
	userId: string
	createdAt: Date
	updatedAt: Date
}

const defaultProject: Project = {
	id: 'default',
	name: 'Default Project',
	userId: '',
	createdAt: new Date(),
	updatedAt: new Date()
}

function createActiveProjectStore() {
	const { subscribe, set, update } = writable<Project>(defaultProject)

	return {
		subscribe,
		setActive: (project: Project) => set(project),
		reset: () => set(defaultProject),
		update
	}
}

export const activeProject = createActiveProjectStore()