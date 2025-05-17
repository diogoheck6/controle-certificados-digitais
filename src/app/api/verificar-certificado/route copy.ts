// app\api\verificar-certificado\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { Certificate } from '../../../lib/certificate';
import { isCNPJ, limparCNPJ } from '@/utils/utils';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const senha = formData.get('senha') as string;
        const grupo = formData.get('grupo') as string;

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ message: 'Nenhum arquivo foi enviado' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'uploads');
        await fsPromises.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, file.name);
        const buffer = await file.arrayBuffer();
        await fsPromises.writeFile(filePath, Buffer.from(buffer));

        const certificate = new Certificate(filePath, senha);

        if (!certificate.valid) {
            return NextResponse.json({ message: 'Senha inválida' }, { status: 401 });
        }

        const [nome, cnpjCpf] = (certificate.clientName || "").split(':').map(s => s.trim());


        // Usando um fallback para a data de expiração caso seja null
        const expirationDate = certificate.expirationDate ? new Date(certificate.expirationDate) : new Date();
        if (isNaN(expirationDate.getTime())) {
            throw new Error('Data de expiração inválida');
        }

        const isCNPJ = cnpjCpf.length === 14;
        const baseDir = isCNPJ ? process.env.E_CNPJ_DIR : process.env.E_CPF_DIR;
        if (!baseDir) {
            throw new Error(`Diretório base não definido para ${isCNPJ ? 'CNPJ' : 'CPF'}.`);
        }

        const fileExtension = path.extname(file.name);
        const targetFileName = `${nome} - ${cnpjCpf}${fileExtension}`;
        const targetFilePath = path.join(baseDir, targetFileName);

        await fsPromises.mkdir(baseDir, { recursive: true });
        const fileExisted = await handleExistingFile(baseDir, cnpjCpf);

        await fsPromises.copyFile(filePath, targetFilePath);
        await fsPromises.unlink(filePath);

        const currentTime = new Date();
        const daysToExpire = Math.floor((expirationDate.getTime() - currentTime.getTime()) / (1000 * 3600 * 24));

        let statusCertificado = 'A Vencer';
        if (daysToExpire < 0) statusCertificado = 'Vencido';
        else if (daysToExpire <= 30) statusCertificado = 'Vencendo em Breve';

        const tipoCertificado = isCNPJ ? 'e-CNPJ' : 'e-CPF';

        await prisma.certificado.upsert({
            where: { cnpjCpf },
            update: {
                nome,
                cnpjCpf,
                senha,
                dataVencimento: expirationDate,
                diasParaVencimento: daysToExpire,
                tipoCertificado,
                statusCertificado,
                statusSenha: '',
                grupo,
                path: targetFilePath,
            },
            create: {
                nome,
                cnpjCpf,
                senha,
                dataVencimento: expirationDate,
                diasParaVencimento: daysToExpire,
                tipoCertificado,
                statusCertificado,
                statusSenha: '',
                grupo,
                path: targetFilePath,
            }
        });

        return NextResponse.json({
            nome,
            cnpj: cnpjCpf,
            expirationDate: expirationDate.toISOString(),
            daysToExpire,
            message: fileExisted ? 'Certificado substituído com sucesso!' : 'Certificado salvo com sucesso!'
        }, { status: 200 });

    } catch (error) {
        // Assegurando que o 'error' tem uma mensagem
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao processar upload';
        console.error('Erro ao processar requisição:', errorMessage);
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

async function handleExistingFile(directory: string, cnpjCpf: string): Promise<boolean> {
    try {
        const files = await fsPromises.readdir(directory);
        for (const file of files) {
            if (file.includes(` - ${cnpjCpf}`)) {
                const filePath = path.join(directory, file);
                await fsPromises.unlink(filePath);
                console.log(`Arquivo existente removido: ${filePath}`);
                return true;
            }
        }
    } catch (error) {
        console.error('Erro ao ler o diretório:', error);
    }
    return false;
}