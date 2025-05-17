/*
  Warnings:

  - A unique constraint covering the columns `[cnpjCpf]` on the table `Certificado` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Certificado_cnpjCpf_key" ON "Certificado"("cnpjCpf");
