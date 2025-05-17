/*
  Warnings:

  - Added the required column `grupo` to the `Certificado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificado" ADD COLUMN     "grupo" TEXT NOT NULL;
