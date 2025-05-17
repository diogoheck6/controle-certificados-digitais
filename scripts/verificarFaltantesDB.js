// script.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    try {
        // Obter CNPJs/CPFs do banco de dados
        const certificados = await prisma.certificado.findMany({
            select: {
                cnpjCpf: true
            }
        });
        const cnpjsCpfsDoBanco = certificados.map(certificado => certificado.cnpjCpf);

        // Caminhos das pastas
        const cnpjDir = process.env.E_CNPJ_DIR;
        const cpfDir = process.env.E_CPF_DIR;

        // Função para listar e extrair CNPJs/CPFs dos arquivos do diretório
        const extrairCnpjCpf = (diretorio) => {
            return fs.readdirSync(diretorio).map(arquivo => {
                const partes = arquivo.split(' - ');
                if (partes.length >= 2) {
                    const cnpjCpfComExtensao = partes[1];
                    return path.basename(cnpjCpfComExtensao, path.extname(cnpjCpfComExtensao));
                } else {
                    console.warn(`Nome de arquivo inesperado: ${arquivo} no diretório ${diretorio}`);
                    return null;
                }
            }).filter(entry => entry !== null); // Remove entradas nulas da lista
        };

        // Obter CNPJs/CPFs das pastas
        const cnpjsDoSistema = extrairCnpjCpf(cnpjDir);
        const cpfsDoSistema = extrairCnpjCpf(cpfDir);

        const cnpjsCpfsDoSistema = [...cnpjsDoSistema, ...cpfsDoSistema]; // Uni ambos

        // Encontrar os CNPJs/CPFs que estão no banco mas não no sistema de arquivos
        const cnpjsCpfsParaRemover = cnpjsCpfsDoBanco.filter(cnpjCpf => !cnpjsCpfsDoSistema.includes(cnpjCpf));

        console.log('CNPJs/CPFs para serem removidos do banco:', cnpjsCpfsParaRemover);

        // Remover estes CNPJs/CPFs do banco de dados
        for (const cnpjCpf of cnpjsCpfsParaRemover) {
            await prisma.certificado.deleteMany({
                where: {
                    cnpjCpf: cnpjCpf
                }
            });
            console.log(`Certificado com CNPJ/CPF ${cnpjCpf} removido.`);
        }

    } catch (error) {
        console.error('Erro durante a execução do script:', error);
    } finally {
        await prisma.$disconnect();
        process.exit();
    }
}

main();