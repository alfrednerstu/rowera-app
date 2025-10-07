import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export interface Project {
	id: string
	name: string
	userId: string
	createdAt: Date
	updatedAt: Date
}

const defaultProject: Project = {
	id: 'default',
	name: 'Select project',
	userId: '',
	createdAt: new Date(),
	updatedAt: new Date()
}

function createActiveProjectStore() {
	// Initialize from session storage if available
	const initialProject = browser && sessionStorage.getItem('activeProject') 
		? JSON.parse(sessionStorage.getItem('activeProject')!) 
		: defaultProject

	const { subscribe, set, update } = writable<Project>(initialProject)

	return {
		subscribe,
		setActive: (project: Project) => {
			set(project)
			// Persist to session storage
			if (browser) {
				sessionStorage.setItem('activeProject', JSON.stringify(project))
				// Also set a cookie for server-side access
				document.cookie = `activeProjectId=${project.id}; path=/; SameSite=Lax`
			}
		},
		reset: () => {
			set(defaultProject)
			if (browser) {
				sessionStorage.removeItem('activeProject')
				document.cookie = 'activeProjectId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
			}
		},
		update
	}
}

export const activeProject = createActiveProjectStore()