/*
  Warnings:

  - Added the required column `colorKey` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconKey` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalizedTitle` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "CategoryTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "description" TEXT,
    "iconKey" TEXT NOT NULL,
    "colorKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "normalizedTitle" TEXT NOT NULL,
    "description" TEXT,
    "iconKey" TEXT NOT NULL,
    "colorKey" TEXT NOT NULL,
    "templateId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CategoryTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "Category_userId_idx" ON "Category"("userId");
CREATE INDEX "Category_templateId_idx" ON "Category"("templateId");
CREATE UNIQUE INDEX "Category_userId_normalizedTitle_key" ON "Category"("userId", "normalizedTitle");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTemplate_key_key" ON "CategoryTemplate"("key");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTemplate_normalizedTitle_key" ON "CategoryTemplate"("normalizedTitle");
