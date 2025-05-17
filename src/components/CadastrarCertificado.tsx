//src/components/CadastrarCertificado.tsx
import React, { useState } from 'react';
import ModalCadastroCertificado from './ModalCadastroCertificado';
import { AiOutlineUpload } from 'react-icons/ai'; // Importa o ícone de upload



const CadastrarCertificado: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <button
                className="flex items-center bg-[var(--amarelo-claro)] hover:bg-[var(--amarelo-forte)] text-zinc-800 font-semibold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                onClick={openModal}
            >
                <AiOutlineUpload className="mr-2" size={20} /> {/* Ícone de upload à esquerda do texto */}
                Certificado
            </button>

            <ModalCadastroCertificado
                showModal={showModal}
                onClose={closeModal}

            />
        </>
    );
};

export default CadastrarCertificado;