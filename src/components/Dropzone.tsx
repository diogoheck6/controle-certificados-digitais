//src/components/Dropzone.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';

interface DropzoneProps {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded }) => {
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles[0]) {
            const file = acceptedFiles[0];
            setFileName(file.name);
            onFileUploaded(file);
        }
    }, [onFileUploaded]);

    const accept: Accept = {
        'application/x-pkcs12': ['.p12', '.pfx'],
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps({
                className: 'dropzone',
                style: {
                    backgroundColor: '#041E41', // azul site
                    color: 'white',
                    border: '2px dashed #D7BC7A', // amarelo claro
                    borderRadius: '10px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease',
                },
            })}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Solte o arquivo aqui...</p>
            ) : (
                <p>{fileName ? `Arquivo: ${fileName}` : 'Arraste e solte um certificado digital aqui, ou clique para selecionar'}</p>
            )}
        </div>
    );
};

export default Dropzone;