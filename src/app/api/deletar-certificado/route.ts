// app\api\deletar-certificado\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { promises as fsPromises } from 'fs';

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        const { cnpjCpf } = await req.json();

        // Procura o certificado no banco de dados
        const certificado = await prisma.certificado.findUnique({
            where: { cnpjCpf },
        });

        if (!certificado) {
            return NextResponse.json(
                { message: 'Certificado não encontrado no banco de dados.' },
                { status: 404 }
            );
        }

        // Remove o arquivo do sistema de arquivos
        const filePath = certificado.path;
        if (filePath) {
            try {
                await fsPromises.unlink(filePath);
                console.log(`Arquivo removido: ${filePath}`);
            } catch (error) {
                console.error(`Erro ao remover o arquivo: ${filePath}`, error);
                throw new Error('Não foi possível deletar o arquivo do sistema.');
            }
        }

        // Deleta o registro do banco de dados
        await prisma.certificado.delete({
            where: { cnpjCpf },
        });

        return NextResponse.json(
            { message: 'Certificado deletado com sucesso!' },
            { status: 200 }
        );

    } catch (error) {
        // Assegurando que o error é um objeto com a propriedade message
        const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar certificado.';
        console.error('Erro ao deletar certificado:', errorMessage);

        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}