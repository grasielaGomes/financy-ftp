import type { PrismaClientLike } from '@/types/prisma'

type BootstrapResult = {
  createdCount: number
  templateCount: number
}

export const categoryBootstrap = async (
  prisma: PrismaClientLike,
  userId: string,
): Promise<BootstrapResult> => {
  const templates = await prisma.categoryTemplate.findMany({
    select: {
      id: true,
      name: true,
      normalizedTitle: true,
      description: true,
      iconKey: true,
      colorKey: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  if (templates.length === 0) return { createdCount: 0, templateCount: 0 }

  const existing = await prisma.category.findMany({
    where: { userId },
    select: { normalizedTitle: true },
  })

  const existingSet = new Set(
    existing.map((category) => category.normalizedTitle),
  )

  const toCreate = templates
    .filter((template) => !existingSet.has(template.normalizedTitle))
    .map((template) => ({
      userId,
      templateId: template.id,
      name: template.name,
      normalizedTitle: template.normalizedTitle,
      description: template.description ?? null,
      iconKey: template.iconKey,
      colorKey: template.colorKey,
    }))

  if (toCreate.length === 0) {
    return { createdCount: 0, templateCount: templates.length }
  }

  const res = await prisma.category.createMany({
    data: toCreate,
  })

  return { createdCount: res.count, templateCount: templates.length }
}
