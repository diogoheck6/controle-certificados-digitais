// app/api/editar-certificado/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    try {
        const { id, grupo, senha } = await req.json();

        const updatedCertificado = await prisma.certificado.update({
            where: { id },
            data: { grupo, senha },
        });

        return NextResponse.json({ certificado: updatedCertificado, message: 'Certificado atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar certificado:', error);
        return NextResponse.json({ message: 'Erro ao atualizar certificado.' }, { status: 500 });
    }
}