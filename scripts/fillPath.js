const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

const E_CNPJ_DIR = "//192.168.5.254/arquivos/ARQUIVOS/12 - SETOR SOCIETÁRIO/ANE/32 Certificado Baixados/E-cnpj";
const E_CPF_DIR = "//192.168.5.254/arquivos/ARQUIVOS/12 - SETOR SOCIETÁRIO/ANE/32 Certificado Baixados/E-cpf";

async function main() {
    try {
        const certificados = await prisma.certificado.findMany();

        for (const cert of certificados) {
            let filePath = await findFile(E_CNPJ_DIR, cert.cnpjCpf);

            if (!filePath) {
                filePath = await findFile(E_CPF_DIR, cert.cnpjCpf);
            }

            if (filePath) {
                await prisma.certificado.update({
                    where: { id: cert.id },
                    data: { path: filePath },
                });
                console.log(`Atualizado o path para o certificado com ID ${cert.id}`);
            } else {
                await prisma.certificado.delete({
                    where: { id: cert.id },
                });
                console.log(`Certificado com ID ${cert.id} removido devido à falta de arquivo correspondente.`);
            }
        }
    } catch (error) {
        console.error('Erro ao preencher os paths: ', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function findFile(dir, cnpjCpfTarget) {
    try {
        const files = await fs.readdir(dir);
        for (const file of files) {
            const [_, cnpjCpf] = file.split(' - ');
            if (cnpjCpf && cnpjCpf.split('.')[0] === cnpjCpfTarget) {
                return path.join(dir, file);
            }
        }
    } catch (error) {
        console.error(`Erro ao ler o diretório ${dir}: `, error);
    }
    return null;
}

main();