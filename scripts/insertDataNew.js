const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

async function main() {
    try {
        // Carrega o arquivo Excel
        const workbook = XLSX.readFile('./certificados1.xlsx');

        const processSheet = (sheetName, tipoCertificado) => {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: ['Nome', 'CNPJ/CPF', 'Senha'], range: 1 });

            return data.map(row => {
                const cnpjCpf = (typeof row['CNPJ/CPF'] === 'number') ? String(row['CNPJ/CPF']) : row['CNPJ/CPF'];
                const senha = (typeof row.Senha === 'number') ? String(row.Senha) : row.Senha;

                if (typeof cnpjCpf !== 'string' || typeof senha !== 'string') {
                    console.error(`Formato inválido em ${sheetName}: `, row);
                    return null;
                }

                const cnpjCpfClean = cnpjCpf.replace(/[^0-9]/g, "");
                const tipo = cnpjCpfClean.length === 14 ? 'e-CNPJ' : 'e-CPF';

                return {
                    nome: row.Nome,
                    cnpjCpf: cnpjCpfClean,
                    senha: senha,
                    tipoCertificado: tipoCertificado || tipo,
                    dataVencimento: new Date(),
                    diasParaVencimento: 0,
                    statusCertificado: "A Vencer",
                    statusSenha: "Válida",
                    path: ""
                };
            }).filter(certificado => certificado !== null);
        };

        const certificadosCNPJ = processSheet('E-cnpj', 'e-CNPJ');
        const certificadosCPF = processSheet('E-cpf', 'e-CPF');

        for (const certificado of [...certificadosCNPJ, ...certificadosCPF]) {
            // Usar findFirst para verificar se o CNPJ/CPF já existe
            const existingCertificado = await prisma.certificado.findFirst({
                where: { cnpjCpf: certificado.cnpjCpf }
            });

            if (!existingCertificado) {
                // Apenas criar novo registro se não existir
                await prisma.certificado.create({ data: certificado });
            } else {
                console.log(`Certificado com CNPJ/CPF ${certificado.cnpjCpf} já existe e foi ignorado.`);
            }
        }

        console.log('Dados inseridos no banco com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir dados: ', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();