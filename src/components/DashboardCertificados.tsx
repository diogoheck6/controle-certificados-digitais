//src/components/DashboardCertificados.tsx

import { useCertificados } from '@/contexts/CertificadosContext';
import React from 'react';


const DashboardCertificados: React.FC = () => {
    const { certificados } = useCertificados();

    const numECPF = certificados.filter(c => c.tipoCertificado === 'e-CPF').length;
    const numECNPJ = certificados.filter(c => c.tipoCertificado === 'e-CNPJ').length;

    const numVencidosECPF = certificados.filter(c => c.tipoCertificado === 'e-CPF' && c.statusCertificado === 'Vencido').length;
    const numVencidosECNPJ = certificados.filter(c => c.tipoCertificado === 'e-CNPJ' && c.statusCertificado === 'Vencido').length;

    const numAVencerECPF = certificados.filter(c => c.tipoCertificado === 'e-CPF' && c.statusCertificado === 'A Vencer').length;
    const numAVencerECNPJ = certificados.filter(c => c.tipoCertificado === 'e-CNPJ' && c.statusCertificado === 'A Vencer').length;

    const numVencendoEmBreveECPF = certificados.filter(c => c.tipoCertificado === 'e-CPF' && c.statusCertificado === 'Vencendo em Breve').length;
    const numVencendoEmBreveECNPJ = certificados.filter(c => c.tipoCertificado === 'e-CNPJ' && c.statusCertificado === 'Vencendo em Breve').length;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-6">
            <DashboardCard title="e-CNPJ Vencidos" count={numVencidosECNPJ} />
            <DashboardCard title="e-CNPJ Venc. em Breve" count={numVencendoEmBreveECNPJ} />
            <DashboardCard title="e-CNPJ A Vencer" count={numAVencerECNPJ} />
            <DashboardCard title="e-CNPJ Totais" count={numECNPJ} />
            <DashboardCard title="e-CPF Vencidos" count={numVencidosECPF} />
            <DashboardCard title="e-CPF Venc. em Breve" count={numVencendoEmBreveECPF} />
            <DashboardCard title="e-CPF A Vencer" count={numAVencerECPF} />
            <DashboardCard title="e-CPF Totais" count={numECPF} />
        </div>
    );
};

const DashboardCard: React.FC<{ title: string; count: number }> = ({ title, count }) => (
    <div className="flex flex-col justify-center items-center bg-[#906C34] text-white rounded-xl shadow-md p-6 transition-transform transform hover:scale-105">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-3xl font-bold">{count}</p>
    </div>
);

export default DashboardCertificados;