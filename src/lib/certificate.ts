//src\lib\certificate.ts

import fs from 'fs';
import forge from 'node-forge';
import path from 'path';

export class Certificate {
    path: string;
    name: string;
    password: string | null;
    clientName: string;
    identifier: string;
    expirationDate: Date | null;
    valid: boolean;

    constructor(certPath: string, password: string | null = null) {
        this.path = certPath;
        this.name = path.basename(certPath);
        this.password = password;
        this.clientName = "Desconhecido";
        this.identifier = "Desconhecido";
        this.expirationDate = null;
        this.valid = this.loadAndExtractInfo();
    }

    loadAndExtractInfo() {
        try {
            const p12Buffer = fs.readFileSync(this.path, 'binary');
            const p12Asn1 = forge.asn1.fromDer(p12Buffer);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, this.password || undefined);

            const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
            const certBagArray = certBags[forge.pki.oids.certBag];

            if (certBagArray && certBagArray.length > 0) {
                const cert = certBagArray[0]?.cert;

                if (cert) {
                    this.clientName = cert.subject.getField('CN').value || "Desconhecido";
                    this.expirationDate = cert.validity.notAfter || null;
                    this.identifier = this.extractIdentifierFromName(this.clientName);
                    return true;
                } else {
                    console.error('Certificado não foi encontrado no CertBag.');
                    return false;
                }
            } else {
                console.error('CertBag está vazio ou indefinido.');
                return false;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao carregar o certificado ${this.name} com senha '${this.password}':`, error.message);
            } else {
                console.error(`Erro desconhecido ao carregar o certificado ${this.name}.`);
            }
            return false;
        }
    }

    extractIdentifierFromName(name: string) {
        const parts = name.split(" - ");
        if (parts.length > 1) {
            return parts[parts.length - 1].trim();
        }
        return "Desconhecido";
    }
}