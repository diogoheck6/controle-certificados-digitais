//src/app/layout.tsx
import React from 'react';
import './globals.css';
import { CertificadoProvider } from '@/contexts/CertificadosContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CertificadoProvider>
            <html lang="pt-BR">
                <head>
                    <title>Controle de Certificados</title>
                </head>
                <body className="min-h-screen bg-zinc-900 text-white">
                    {children}
                </body>
            </html>
        </CertificadoProvider>
    );
};

export default Layout;