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

  // Packets that belong to the user's projects (filtered by active project if specified)
  const userPackets = await db
    .select({
      id: packet.id,
      name: packet.name,
      slug: packet.slug,
      projectId: packet.projectId,
      projectName: project.name,
      createdAt: packet.createdAt,
      updatedAt: packet.updatedAt
    })
    .from(packet)
    .innerJoin(project, eq(packet.projectId, project.id))
    .where(projectCondition)

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

  // User's projects for forms
  const userProjects = await db
    .select()
    .from(project)
    .where(eq(project.userId, user.id))

  return {
    packets: userPackets,
    pieces: userPieces,
    presets: userPresets,
    projects: userProjects
  }
}