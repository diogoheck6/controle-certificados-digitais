
// src/utils/utils.ts

import { Certificado } from '@/interfaces/certificado'; // Importe a interface se necessário

export function formatarCnpjCpf(value: string): string {
    if (value.length === 14) {
        return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"); // CNPJ
    } else if (value.length === 11) {
        return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"); // CPF
    }
    return value;
}

export function transformarNomesParaMaiusculas(certificados: Certificado[]): Certificado[] {
    return certificados.map(certificado => ({
        ...certificado, // Preserva todos os campos originais
        nome: certificado.nome.toUpperCase() // Modifica apenas o campo 'nome'
    }));
}


// src/utils/utils.ts

/**
 * Remove pontos, barras, hífens e espaços de um CNPJ.
 */
export function limparCNPJ(cnpj: string) {
    return (cnpj || '').replace(/[.\-\/\s]/g, '');
}

/**
 * Checa se a string é um CNPJ válido apenas por formato.
 */
export function ehCNPJ(val: string): boolean {
    const cnpj = limparCNPJ(val);
    return /^\d{14}$/.test(cnpj);
}