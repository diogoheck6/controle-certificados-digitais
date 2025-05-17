//src\components\TabelaCertificados.tsx
import React, { useState, useEffect } from 'react';
import { Certificado } from '../interfaces/certificado';
import { formatarCnpjCpf } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import { useCertificados } from '@/contexts/CertificadosContext';

interface Filtro {
    tipoCertificado: string;
    statusCertificado: string;
    statusSenha: string;
    busca: string;
    grupo: string;
}

interface TabelaCertificadosProps {
    filtro: Filtro;
}

const TabelaCertificados: React.FC<TabelaCertificadosProps> = ({ filtro }) => {
    const { certificados, removerCertificado } = useCertificados(); // Usando o contexto para acessar os certificados
    const [filtradosCertificados, setFiltradosCertificados] = useState<Certificado[]>(certificados);
    const [selectedCertificado, setSelectedCertificado] = useState<Certificado | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Certificado | null, direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });

    const sortedCertificados = React.useMemo(() => {
        const sortableCertificados = [...filtradosCertificados];
        if (sortConfig.key) {
            sortableCertificados.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (aValue === undefined || bValue === undefined) {
                    if (aValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (bValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableCertificados;
    }, [filtradosCertificados, sortConfig]);

    const openModal = (certificado: Certificado) => {
        setSelectedCertificado(certificado);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedCertificado(null);
        setShowModal(false);
    };

    const openDeleteModal = (certificado: Certificado) => {
        setSelectedCertificado(certificado);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedCertificado(null);
        setShowDeleteModal(false);
    };

    const handleDeleteCertificado = async () => {
        if (!selectedCertificado) return;
        try {
            await removerCertificado(selectedCertificado.cnpjCpf); // Utilizando o contexto para deletar o certificado
            // alert('Certificado deletado com sucesso!');
            closeDeleteModal();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao tentar deletar o certificado.');
        }
    };


    // const handleUpdateCertificado = (updatedCertificado: Certificado) => {
    //     setFiltradosCertificados(prevCertificados =>
    //         prevCertificados.map(cert =>
    //             cert.id === updatedCertificado.id ? updatedCertificado : cert
    //         )
    //     );
    //     setShowModal(false);
    // };

    const requestSort = (key: keyof Certificado) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        setFiltradosCertificados(certificados.filter((certificado) => {
            const matchesBusca = filtro.busca
                ? certificado.nome.toLowerCase().includes(filtro.busca.toLowerCase()) ||
                certificado.cnpjCpf.includes(filtro.busca)
                : true;

            const matchesGrupo = filtro.grupo
                ? certificado.grupo?.toLowerCase().includes(filtro.grupo.toLowerCase())
                : true;

            return matchesBusca &&
                matchesGrupo &&
                (filtro.tipoCertificado ? certificado.tipoCertificado === filtro.tipoCertificado : true) &&
                (filtro.statusCertificado ? certificado.statusCertificado === filtro.statusCertificado : true) &&
                (filtro.statusSenha ? certificado.statusSenha === filtro.statusSenha : true);
        }));
    }, [filtro, certificados]);



    return (
        <>
            <div className="overflow-x-auto mx-4 sm:mx-0 relative z-10 ">
                <table className="min-w-full text-sm text-center bg-[#041E41] shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-[#041E41] text-[#D7BC7A]">
                        <tr>
                            {['nome', 'cnpjCpf', 'grupo', 'dataVencimento', 'diasParaVencimento', 'tipoCertificado', 'senha', 'statusCertificado'].map((key, index) => (
                                <th key={index} className="px-6 py-4 cursor-pointer hover:bg-[#906C34] transition-colors" onClick={() => requestSort(key as keyof Certificado)}>
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                    <FontAwesomeIcon icon={
                                        sortConfig.key === key ? (sortConfig.direction === 'ascending' ? faSortUp : faSortDown) : faSort
                                    } />
                                </th>
                            ))}
                            <th className="px-6 py-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#D7BC7A]">
                        {sortedCertificados.map((certificado, rowIndex) => (
                            <tr key={certificado.id || certificado.cnpjCpf} className={`border-t border-[#906C34] ${rowIndex % 2 === 0 ? 'bg-[#041E41]' : 'bg-[#041E41] opacity-75'} transition hover:shadow-lg hover:bg-[#906C34]`}>
                                <td className="px-6 py-4">{certificado.nome}</td>
                                <td className="px-6 py-4">{formatarCnpjCpf(certificado.cnpjCpf)}</td>
                                <td className="px-6 py-4">{certificado.grupo ?? 'N/A'}</td>
                                <td className="px-6 py-4">
                                    {certificado.dataVencimento ? new Date(certificado.dataVencimento).toLocaleDateString() : 'Data Inválida'}
                                </td>
                                <td className="px-6 py-4">{certificado.diasParaVencimento}</td>
                                <td className="px-6 py-4">{certificado.tipoCertificado}</td>
                                <td className="px-6 py-4">{certificado.senha}</td>
                                <td className="px-6 py-4">{certificado.statusCertificado}</td>
                                <td className="px-6 py-4 flex justify-center items-center space-x-2">
                                    <button
                                        className="bg-[#D7BC7A] hover:bg-[#906C34] text-[#041E41] font-bold py-1 px-2 rounded-lg transition-all"
                                        onClick={() => openModal(certificado)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg transition-all"
                                        onClick={() => openDeleteModal(certificado)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCertificado && showModal && (
                <Modal
                    showModal={showModal}
                    onClose={closeModal}
                    certificado={selectedCertificado}
                />
            )}

            {selectedCertificado && showDeleteModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 modal-overlay"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-[#041E41] text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                            <h3 className="text-lg mb-4">Tem certeza que deseja deletar o certificado <strong>{selectedCertificado.nome}</strong>?</h3>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-[#906C34] hover:bg-[#D7BC7A] text-white font-semibold rounded-lg shadow-md transition-all duration-150"
                                    onClick={closeDeleteModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-[#D7BC7A] hover:bg-[#906C34] text-[#041E41] font-semibold rounded-lg shadow-md transition-all duration-150"
                                    onClick={handleDeleteCertificado}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default TabelaCertificados;