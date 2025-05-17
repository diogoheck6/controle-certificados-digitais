// src/components/Header.tsx
import React from 'react';
import Image from 'next/image';
import logo from '../assets/logo.png'; // Certifique-se do caminho correto para a imagem

const Header: React.FC = () => {
    return (
        <header className="flex justify-between items-center px-6 py-3 bg-[var(--azul-site)] text-white shadow-md mb-8">
            <div className="flex items-center">
                <Image
                    src={logo}
                    alt="Logo da Navecon"
                    width={230}
                    height={44}
                />
            </div>
            <h1 className="text-2xl font-light tracking-wide text-center">Controle de Certificados</h1>
            <div className="w-64"></div> {/* Espaço vazio para equilibrar a flexbox */}
        </header>
    );
};

export default Header;