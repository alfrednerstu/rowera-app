import { db } from '$lib/server/db'
import { project, packet, piece, preset } from '$lib/server/db/schema'
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