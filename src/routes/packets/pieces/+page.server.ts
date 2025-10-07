import { db } from '$lib/server/db'
import { project, packet, piece, preset } from '$lib/server/db/schema'
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
      pieces: []
    }
  }

  // Build base conditions
  const userCondition = eq(project.userId, user.id)
  const projectCondition = and(userCondition, eq(project.id, activeProjectId))

  // Pieces with packet and preset information
  const userPieces = await db
    .select({
      id: piece.id,
      name: piece.name,
      slug: piece.slug,
      packetId: piece.packetId,
      packetName: packet.name,
      presetId: piece.presetId,
      presetName: preset.name,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    })
    .from(piece)
    .innerJoin(packet, eq(piece.packetId, packet.id))
    .innerJoin(project, eq(packet.projectId, project.id))
    .innerJoin(preset, eq(piece.presetId, preset.id))
    .where(projectCondition)

  return {
    pieces: userPieces
  }
}