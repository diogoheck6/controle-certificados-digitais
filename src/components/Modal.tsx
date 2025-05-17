//src\components\modal.tsx
import React, { useState, useEffect } from 'react';
import { Certificado } from '../interfaces/certificado';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';  // Importa os ícones de olho
import { useCertificados } from '@/contexts/CertificadosContext';

interface ModalProps {
    showModal: boolean;
    onClose: () => void;
    certificado: Certificado | null;
}

const Modal: React.FC<ModalProps> = ({ showModal, onClose, certificado }) => {
    const { editarCertificado } = useCertificados(); // Utilize o contexto


    const [grupo, setGrupo] = useState(certificado ? certificado.grupo || '' : '');
    const [senha, setSenha] = useState(certificado ? certificado.senha : '');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (certificado) {
            setGrupo(certificado.grupo || '');
            setSenha(certificado.senha);
        }
    }, [certificado]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            if (certificado) {
                await editarCertificado(certificado.id, grupo, senha);
                onClose();
            }
        } catch (error) {
            console.error('Erro durante a atualização do certificado:', error);
            setErrorMessage('Erro ao atualizar o certificado.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!showModal || !certificado) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 modal-overlay"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-[#041E41] text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Editar Certificado</h2>
                        <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={onClose} />
                    </div>
                    {errorMessage && (
                        <div className="bg-red-600 text-white p-3 rounded mb-4">
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            {errorMessage}
                        </div>
                    )}
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Nome</label>
                                <input
                                    type="text"
                                    value={certificado.nome}
                                    disabled
                                    className="w-full bg-zinc-800 text-white border border-gray-600 rounded-lg shadow-sm px-4 py-2"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">CNPJ/CPF</label>
                                <input
                                    type="text"
                                    value={certificado.cnpjCpf}
                                    disabled
                                    className="w-full bg-zinc-800 text-white border border-gray-600 rounded-lg shadow-sm px-4 py-2"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Grupo</label>
                                <input
                                    type="text"
                                    value={grupo}
                                    onChange={(e) => setGrupo(e.target.value)}
                                    className="w-full bg-zinc-800 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--amarelo-claro)] px-4 py-2"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Senha</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        className="w-full bg-zinc-800 text-white border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--amarelo-claro)] px-4 py-2 pr-10"
                                    />
                                    <span
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[var(--amarelo-claro)]"
                                    >
                                        {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-[#906C34] hover:bg-[#D7BC7A] text-white font-semibold rounded-lg shadow-md transition-all duration-150"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="py-2 px-4 bg-[#D7BC7A] hover:bg-[#906C34] text-[#041E41] font-semibold rounded-lg shadow-md transition-all duration-150"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;