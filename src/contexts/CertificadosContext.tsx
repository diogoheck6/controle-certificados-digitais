//src\contexts\CertificadosContext.tsx
'use client'
// CertificadoContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Certificado } from '../interfaces/certificado';

interface CertificadoContextProps {
    certificados: Certificado[];
    adicionarCertificado: (file: File, senha: string, grupo: string) => Promise<boolean>;
    removerCertificado: (cnpjCpf: string) => Promise<void>;
    atualizarCertificados: () => void;
    editarCertificado: (id: number, grupo: string, senha: string) => Promise<void>;
}

const CertificadoContext = createContext<CertificadoContextProps | undefined>(undefined);

export const useCertificados = () => {
    const context = useContext(CertificadoContext);
    if (!context) {
        throw new Error('useCertificados must be used within a CertificadoProvider');
    }
    return context;
};

export const CertificadoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [certificados, setCertificados] = useState<Certificado[]>([]);

    // Função para editar um certificado
    const editarCertificado = async (id: number, grupo: string, senha: string) => {
        try {
            const response = await fetch('/api/editar-certificado', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, grupo, senha }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Certificado atualizado detalhes:', result);
                setCertificados(prev =>
                    prev.map(certificado =>
                        certificado.id === id ? { ...certificado, grupo, senha } : certificado
                    )
                );
                alert('Certificado atualizado com sucesso!');
            } else {
                throw new Error('Erro ao atualizar o certificado.');
            }
        } catch (error) {
            console.error('Erro ao atualizar certificado:', error);
            alert('Erro ao atualizar certificado. Por favor, tente novamente.');
        }
    };


    const adicionarCertificado = async (file: File, senha: string, grupo: string): Promise<boolean> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('senha', senha);
        formData.append('grupo', grupo || '');

        try {
            const response = await fetch('/api/verificar-certificado', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            console.log('Resposta da API:', result);


            if (!response.ok) {
                // Apenas exiba o erro sem lançar uma exceção que irá para o catch
                alert(result.message || 'Erro ao adicionar certificado');
                return false
            }


            const newCert: Certificado = {
                id: result.id,
                nome: result.nome,
                cnpjCpf: result.cnpj,
                senha: senha,
                dataVencimento: new Date(result.expirationDate).toISOString(),
                diasParaVencimento: result.daysToExpire,
                tipoCertificado: result.tipoCertificado,
                statusCertificado: result.statusCertificado,
                statusSenha: result.statusSenha || 'Indefinido',
                path: result.path,
                grupo: grupo,
            };

            setCertificados((prev) => [...prev, newCert]);
            // Use a mensagem da resposta do backend no alerta
            alert(`${result.message}\nNome: ${result.nome}\nCNPJ/CPF: ${result.cnpj}\nData de Expiração: ${new Date(result.expirationDate).toLocaleDateString()}\nDias para Vencimento: ${result.daysToExpire}`);

            // Recarregue os certificados para garantir que temos a lista mais recente
            await atualizarCertificados();
            return true

        } catch (error) {
            console.error('Erro ao cadastrar certificado:', error);
            alert('Erro ao cadastrar certificado. Por favor, tente novamente.');

            return false
        }
    };

    const removerCertificado = async (cnpjCpf: string) => {
        try {
            const response = await fetch('/api/deletar-certificado', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cnpjCpf }),
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar certificado');
            }

            setCertificados(prev =>
                prev.filter((cert) => cert.cnpjCpf !== cnpjCpf)
            );
            alert('Certificado deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar certificado:', error);
            alert('Erro ao deletar certificado. Por favor, tente novamente.');
        }
    };


    const atualizarCertificados = async () => {
        try {
            const response = await fetch('/api/certificados');
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            setCertificados(data);
        } catch (error) {
            console.error('Erro ao buscar certificados:', error);
        }
    };

    useEffect(() => {
        atualizarCertificados();
    }, []);

    return (
        <CertificadoContext.Provider value={{ certificados, adicionarCertificado, removerCertificado, atualizarCertificados, editarCertificado }}>
            {children}
        </CertificadoContext.Provider>
    );
};