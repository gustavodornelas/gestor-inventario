// src/api/database.js
const mysql = require('mysql');

// Configuração da conexão MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'gustavo',
    password: 'Administr@dor',
    database: 'gestor_documentacao',
});

// Conectar ao banco de dados MySQL
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

module.exports = db;