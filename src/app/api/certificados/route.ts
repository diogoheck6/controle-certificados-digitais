//src/app/api/certificados/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para lidar com requisições GET
export async function GET() {
    try {
        const certificados = await prisma.certificado.findMany({
            orderBy: {
                nome: 'asc', // Ordena em ordem ascendente, use 'desc' para ordem descendente
            },
        });
        return NextResponse.json(certificados);
    } catch (error) {
        console.error('Erro ao obter certificados:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}