const bcrypt = require('bcryptjs');

async function generateFinalHash() {
    // <<<--- DEFINA A SENHA REAL E FORTE QUE VOCÊ DESEJA USAR PARA O ADMIN AQUI!
    // Ex: const finalPassword = 'MinhaSenhaSeguraDeVerdade@2025!';
    const finalPassword = 'a-letra-é-a-senha'; // <<<--- ALtere esta linha!
    const saltRounds = 10; // Mantenha 10, o mesmo do server.js

    try {
        const finalHashedPassword = await bcrypt.hash(finalPassword, saltRounds);
        console.log('--- GERADOR DE HASH BCrypt FINAL ---');
        console.log('Senha Final Plaintext:', finalPassword);
        console.log('Hash Final Gerado (COPIE ESTE COM CUIDADO):', finalHashedPassword);
        console.log('------------------------------------');
    } catch (error) {
        console.error('Erro ao gerar hash final:', error);
    }
}

generateFinalHash();