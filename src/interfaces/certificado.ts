//src\interfaces\certificado.ts



export interface Certificado {
    id: number;
    nome: string;
    cnpjCpf: string;
    senha: string;
    dataVencimento: string;
    diasParaVencimento: number;
    tipoCertificado: string;
    statusCertificado: string;
    statusSenha: string;
    path: string;
    grupo?: string; // Adicionando 'grupo' como uma propriedade opcional
}