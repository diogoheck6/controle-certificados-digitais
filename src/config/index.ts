// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
    ORIGEM: process.env.EMAIL_ORIGEM || '',
    DESTINATARIOS: process.env.EMAIL_DESTINATARIOS ? process.env.EMAIL_DESTINATARIOS.split(',') : [],
    SENHA: process.env.EMAIL_SENHA || '',
};

export const arquivoConfig = {
    E_CNPJ_DIR: process.env.E_CNPJ_DIR || '//192.168.5.254/arquivos/ARQUIVOS/12 - SETOR SOCIETÁRIO/ANE/32 Certificado Baixados/E-cnpj',
    E_CPF_DIR: process.env.E_CPF_DIR || '//192.168.5.254/arquivos/ARQUIVOS/12 - SETOR SOCIETÁRIO/ANE/32 Certificado Baixados/E-cpf',
};

export const appConfig = {
    CHECK_INTERVAL: parseInt(process.env.CHECK_INTERVAL || '86400', 10),
    ALERTA_DIAS: parseInt(process.env.ALERTA_DIAS || '45', 10),
};