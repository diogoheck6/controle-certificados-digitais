-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpjCpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "diasParaVencimento" INTEGER NOT NULL,
    "tipoCertificado" TEXT NOT NULL,
    "statusCertificado" TEXT NOT NULL,
    "statusSenha" TEXT NOT NULL,
    "usuarioId" INTEGER,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
