// start.js

const { exec } = require('child_process');

// Define a porta desejada
const port = process.env.PORT || 3000;  // Defina a porta 3000 ou outra porta

// Inicia o servidor Next.js na porta especificada
exec(`npx next start -p ${port}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
        console.error(`Erro: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
