import { db } from '$lib/server/db'
import { project, packet, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq, and } from 'drizzle-orm'

export async function load({ parent, cookies }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

  const activeProjectId = cookies.get('activeProjectId')

  // Build base conditions
  const userCondition = eq(project.userId, user.id)
  const projectCondition = activeProjectId && activeProjectId !== 'default' 
    ? and(userCondition, eq(project.id, activeProjectId))
    : userCondition

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