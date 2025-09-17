import { db } from '$lib/server/db'
import { project, packet, preset } from '$lib/server/db/schema'
import { redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export async function load({ parent }) {
  const { user } = await parent()

  if (!user?.id) {
    throw redirect(302, '/login')
  }

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
    .where(eq(project.userId, user.id))

  return {
    presets: userPresets
  }
}