//src\components\ModalCadastroCertificado.tsx
'use client'
import React, { useState } from 'react';
import Dropzone from './Dropzone';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useCertificados } from '@/contexts/CertificadosContext';


interface ModalCadastroCertificadoProps {
    showModal: boolean;
    onClose: () => void;
}

const ModalCadastroCertificado: React.FC<ModalCadastroCertificadoProps> = ({ showModal, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [senha, setSenha] = useState('');
    const [grupo, setGrupo] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { adicionarCertificado } = useCertificados();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Por favor, selecione um arquivo para upload.');
            return;
        }

        setIsUploading(true);

        try {
            const success = await adicionarCertificado(file, senha, grupo);

            if (success) {
                // Feche o modal somente quando bem-sucedido
                onClose();
                setFile(null);
                setSenha('');
                setGrupo('');
            }
        } catch (error) {
            // Log o erro e mantenha o modal aberto para que o usuário possa tentar novamente
            console.error('Erro durante o upload:', error);
        } finally {
            // Garanta que o botão de upload seja habilitado novamente
            setIsUploading(false);
        }
    };

    if (!showModal) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 modal-overlay"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-[#041E41] text-white p-8 rounded-lg shadow-lg w-full max-w-lg modal-content">
                    <h2 className="text-2xl mb-6 text-center font-semibold">Carregar Certificado Digital</h2>
                    <div className="mb-6">
                        <Dropzone onFileUploaded={setFile} />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full bg-zinc-800 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--amarelo-claro)] pr-10 py-2 px-4"
                                required
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[var(--amarelo-claro)]"
                            >
                                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium">Grupo</label>
                        <input
                            type="text"
                            value={grupo}
                            onChange={(e) => setGrupo(e.target.value)}
                            className="w-full bg-zinc-800 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--amarelo-claro)] py-2 px-4"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="py-2 px-4 bg-[#906C34] hover:bg-[#D7BC7A] text-white font-semibold rounded-lg shadow-md transition-all duration-150"
                            onClick={onClose}
                            disabled={isUploading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="py-2 px-4 bg-[#D7BC7A] hover:bg-[#906C34] text-white font-semibold rounded-lg shadow-md transition-all duration-150"
                            onClick={handleFileUpload}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Carregando...' : 'Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalCadastroCertificado;