//src\app\page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import TabelaCertificados from '@/components/TabelaCertificados';
import FiltroTabela from '@/components/FiltroTabela';
import DashboardCertificados from '@/components/DashboardCertificados';
import Header from '@/components/Header';

const HomePage = () => {
    const [atualizando, setAtualizando] = useState(true);  // Novo estado para gerenciar a atualização
    const [filtro, setFiltro] = useState({
        tipoCertificado: '',
        statusCertificado: '',
        statusSenha: '',
        busca: '',
        grupo: ''
    });

    const atualizarDadosDiariamente = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const lastUpdate = localStorage.getItem('lastUpdateDate');

            if (lastUpdate !== today) {
                const response = await fetch('/api/atualizar-dados');  // Chama a API para atualizar os dados
                if (!response.ok) {
                    console.error("Erro ao atualizar os dados:", await response.text());
                } else {
                    localStorage.setItem('lastUpdateDate', today);
                    console.log("Dados atualizados.");
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar dados:", error);
        } finally {
            setAtualizando(false);  // Marca a atualização como concluída
        }
    };

    useEffect(() => {
        atualizarDadosDiariamente();  // Tenta atualizar os dados na montagem
    }, []);

    const handleFiltroChange = (filtroNome: string, valor: string) => {
        setFiltro((prev) => ({
            ...prev,
            [filtroNome]: valor
        }));
    };

    return (
        <div className="mx-6 sm:mx-8 md:mx-10 lg:mx-12 xl:mx-16 py-8">
            <Header />
            <div className="fixed-header mb-8">
                <DashboardCertificados />
            </div>
            <div className="mb-8">
                <FiltroTabela onFiltroChange={handleFiltroChange} />
            </div>
            <div className="table-container mt-4">
                {atualizando ? (
                    <div>Atualizando dados...</div>
                ) : (
                    <TabelaCertificados filtro={filtro} />
                )}
            </div>
        </div>
    );
};

export default HomePage;