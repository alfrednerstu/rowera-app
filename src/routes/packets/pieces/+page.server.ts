import { db } from '$lib/server/db'
import { project, packet, piece, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

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
    .where(eq(project.userId, user.id))

  return {
    pieces: userPieces
  }
}