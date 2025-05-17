import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Verifica se o administrador já existe na tabela Usuario
    const existingAdmin = await prisma.usuario.findUnique({
        where: { email: 'mariana.lopes@navecon.net.br' },
    });

    // Se o administrador não existir, crie-o
    if (!existingAdmin) {
        const hashedPassword = await hash('1234', 10);
        await prisma.usuario.create({
            data: {
                nome: 'Mariana Lopes',
                email: 'mariana.lopes@navecon.net.br',
                senha: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('Usuário Administrador criado com sucesso!');
    } else {
        console.log('Usuário Administrador já existe.');
    }

    // Verifica se o e-mail do administrador já está na tabela AllowedEmail
    const adminEmail = await prisma.allowedEmail.findUnique({
        where: { email: 'mariana.lopes@navecon.net.br' },
    });

    // Se o e-mail não estiver lá, adicione-o
    if (!adminEmail) {
        await prisma.allowedEmail.create({
            data: {
                email: 'mariana.lopes@navecon.net.br',
            },
        });
        console.log('E-mail do administrador adicionado à tabela AllowedEmail.');
    } else {
        console.log('E-mail do administrador já está na tabela AllowedEmail.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });