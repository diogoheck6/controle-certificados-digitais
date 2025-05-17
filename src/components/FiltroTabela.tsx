//src\components\FiltroTabela.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineDescription } from 'react-icons/md';
import CadastrarCertificado from './CadastrarCertificado';

interface FiltroTabelaProps {
    onFiltroChange: (filtroNome: string, valor: string) => void;
}

const FiltroTabela: React.FC<FiltroTabelaProps> = ({ onFiltroChange }) => {
    return (
        <div className="flex justify-between items-center space-y-4 flex-wrap md:space-y-0 mb-4 bg-[var(--azul-site)] p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">

                {/* Campo de busca por Nome ou CNPJ/CPF */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por Nome ou CNPJ/CPF"
                        className="bg-zinc-800 border-none py-3 pl-10 pr-4 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--amarelo-claro)] transition w-full md:w-auto"
                        onChange={(e) => onFiltroChange('busca', e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--amarelo-claro)]" />
                </div>

                {/* Campo de busca por Grupo */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por Grupo"
                        className="bg-zinc-800 border-none py-3 pl-10 pr-4 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--amarelo-claro)] transition w-full md:w-auto"
                        onChange={(e) => onFiltroChange('grupo', e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--amarelo-claro)]" />
                </div>

                {/* Filtro de Tipo de Certificado */}
                <div className="relative">
                    <select
                        className="bg-zinc-800 border-none py-3 pl-10 pr-4 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--amarelo-claro)] transition w-full md:w-auto"
                        onChange={(e) => onFiltroChange('tipoCertificado', e.target.value)}
                    >
                        <option value="">Tipo de Certificado</option>
                        <option value="e-CPF">e-CPF</option>
                        <option value="e-CNPJ">e-CNPJ</option>
                    </select>
                    <MdOutlineDescription className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--amarelo-claro)]" />
                </div>

                {/* Filtro de Status do Certificado */}
                <div className="relative">
                    <select
                        className="bg-zinc-800 border-none py-3 pl-10 pr-4 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--amarelo-claro)] transition w-full md:w-auto"
                        onChange={(e) => onFiltroChange('statusCertificado', e.target.value)}
                    >
                        <option value="">Status</option>
                        <option value="A Vencer">A Vencer</option>
                        <option value="Vencendo em Breve">Vencendo em Breve</option>
                        <option value="Vencido">Vencido</option>
                    </select>
                    <MdOutlineDescription className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--amarelo-claro)]" />
                </div>
            </div>

            {/* Botão para cadastrar novo certificado */}
            <div className="mt-4 md:mt-0">
                <CadastrarCertificado />
            </div>
        </div>
    );
};

export default FiltroTabela;