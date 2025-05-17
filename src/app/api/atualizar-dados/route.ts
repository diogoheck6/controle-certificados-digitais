// app/api/atualizar-dados/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const certificados = await prisma.certificado.findMany();
        const currentTime = new Date();

        for (const cert of certificados) {
            const expirationDate = new Date(cert.dataVencimento);
            const daysToExpire = Math.floor((expirationDate.getTime() - currentTime.getTime()) / (1000 * 3600 * 24));

            let statusCertificado = 'A Vencer';
            if (daysToExpire < 0) {
                statusCertificado = 'Vencido';
            } else if (daysToExpire <= 30) {
                statusCertificado = 'Vencendo em Breve';
            }

            await prisma.certificado.update({
                where: { id: cert.id },
                data: { diasParaVencimento: daysToExpire, statusCertificado },
            });
        }

        console.log('Certificados atualizados com sucesso.');
        return NextResponse.json({ message: 'Certificados atualizados com sucesso.' }, { status: 200 });
    } catch (error) {
        console.error('Erro ao atualizar certificados:', error);
        return NextResponse.json({ message: 'Erro ao atualizar certificados.' }, { status: 500 });
    }
}