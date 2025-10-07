import { db } from '$lib/server/db'
import { project, packet, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent, cookies }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  let activeProjectId = cookies.get('activeProjectId')

  // If activeProjectId is 'default', look up the actual Default project
  if (activeProjectId === 'default') {
    const defaultProject = await db
      .select()
      .from(project)
      .where(and(eq(project.userId, user.id), eq(project.name, 'Default')))
      .limit(1)

    if (defaultProject.length > 0) {
      activeProjectId = defaultProject[0].id
    }
  }

  // If still 'default' or not set, return empty arrays
  if (!activeProjectId || activeProjectId === 'default') {
    return {
      presets: []
    }
  }

  // Build base conditions
  const userCondition = eq(project.userId, user.id)
  const projectCondition = and(userCondition, eq(project.id, activeProjectId))

  // Presets that belong to user's packets
  const userPresets = await db
    .select({
      id: preset.id,
      name: preset.name,
      packetId: preset.packetId,
      packetName: packet.name,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt
    })
    .from(preset)
    .innerJoin(packet, eq(preset.packetId, packet.id))
    .innerJoin(project, eq(packet.projectId, project.id))
    .where(projectCondition)

  return {
    presets: userPresets
  }
}