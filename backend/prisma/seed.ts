import 'dotenv/config'
import { seedCategories } from '@financy/contracts'
import { normalizeTitle } from '../src/shared/utils/normalizeTitle'
import { prisma } from '../src/prisma'

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing. Did you load backend/.env?')
  }

  for (const category of seedCategories) {
    await prisma.categoryTemplate.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        normalizedTitle: normalizeTitle(category.name),
        description: category.description,
        iconKey: category.icon,
        colorKey: category.color,
      },
      create: {
        id: category.id,
        key: category.id,
        name: category.name,
        normalizedTitle: normalizeTitle(category.name),
        description: category.description,
        iconKey: category.icon,
        colorKey: category.color,
      },
    })
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
