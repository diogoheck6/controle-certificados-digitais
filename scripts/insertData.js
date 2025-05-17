// insertData.js

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

async function main() {
    try {
        // Carregar o arquivo Excel
        const workbook = XLSX.readFile('./certificados.xlsx');

        const processSheet = (sheetName, tipoCertificado) => {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: ['Nome', 'CNPJ/CPF', 'Senha'], range: 1 });

            return data.map(row => {
                // Converter CNPJ/CPF e Senha para string se não forem
                const cnpjCpf = (typeof row['CNPJ/CPF'] === 'number') ? String(row['CNPJ/CPF']) : row['CNPJ/CPF'];
                const senha = (typeof row.Senha === 'number') ? String(row.Senha) : row.Senha;

                // Validar se ainda são strings
                if (typeof cnpjCpf !== 'string' || typeof senha !== 'string') {
                    console.error(`Formato inválido em ${sheetName}: `, row);
                    return null;
                }

                // Remover caracteres não numéricos de CNPJ/CPF
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
            await prisma.certificado.create({ data: certificado });
        }

        console.log('Dados inseridos no banco com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir dados: ', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();