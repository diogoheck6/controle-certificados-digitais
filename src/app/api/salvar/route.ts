// src/app/api/salvar/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
    try {
        const { id, ...updatedData } = await request.json();

        const updatedCertificado = await prisma.certificado.update({
            where: { id: parseInt(id, 10) },
            data: updatedData,
        });

        return NextResponse.json({ message: 'Certificado atualizado com sucesso!', certificado: updatedCertificado });
    } catch (error) {
        console.error('Falha ao atualizar o certificado:', error);
        return NextResponse.json({ message: 'Erro ao atualizar o certificado.', error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}