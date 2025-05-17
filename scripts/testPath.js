require('dotenv').config();
const fs = require('fs');
const path = require('path');

const testDirectories = () => {
    const directories = [process.env.E_CNPJ_DIR, process.env.E_CPF_DIR];

    directories.forEach(dir => {
        console.log(`Testando acesso ao diretório: ${dir}`);

        try {
            const files = fs.readdirSync(dir);
            console.log(`Arquivos encontrados em ${dir}:`, files);
        } catch (error) {
            console.error(`Erro ao acessar o diretório ${dir}:`, error.message);
        }
    });
};

testDirectories();