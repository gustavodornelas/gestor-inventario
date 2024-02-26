const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database');
const secretKey = '#*#!%)(!f5';

// Função para verificar se o usuário já existe no banco de dados
function verificarUsuarioExistente(usuario) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });
}

// Rota para criar usuários
router.post('/cadastro', async (req, res) => {
    try {
        const { usuario, senha, nome } = req.body;

        // Verifique se o usuário já existe
        const usuarioExistente = await verificarUsuarioExistente(usuario);
        if (usuarioExistente) {
            return res.status(409).json({ message: 'Usuário já existe' });
        }

        // Hash da senha antes de armazenar no banco de dados
        const senhaHash = await bcrypt.hash(senha, 10);

        // Insira o usuário na tabela de usuários
        await db.query(
            'INSERT INTO usuario (usuario, senha, nome) VALUES (?, ?, ?)',
            [usuario, senhaHash, nome]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar a solicitação' });
    }
});

// Rota para login
router.post('/login', async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        // Consulte o banco de dados para obter o usuário
        const sql = 'SELECT * FROM usuario WHERE usuario = ?';
        db.query(sql, [usuario], async (err, result) => {
            if (err) throw err;

            if (result.length === 0) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const dadosUsuario = result[0];

            console.log(dadosUsuario);

            // Verifique a senha usando o campo correto (senha)
            const verificarSenha = await bcrypt.compare(senha, dadosUsuario.senha);
            if (!verificarSenha) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Credenciais válidas, gere um token JWT
            const token = jwt.sign(
                { usuario: dadosUsuario.usuario, id_usuario: dadosUsuario.id },
                secretKey,
                { expiresIn: '1h' }
            );

            // Inserindo o token no banco de dados
            await db.query('INSERT INTO tokens (token, id_usuario) VALUES (?, ?)', [token, dadosUsuario.id]);

            // Retorne uma mensagem indicando que o usuário foi logado com sucesso
            const dadosUsuarioSemSenha = { ...dadosUsuario, senha: undefined };
            res.status(200).json({ message: 'Usuário logado com sucesso', token, usuario: dadosUsuarioSemSenha });
        })

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar a solicitação' });
    }
});

// Rota para logout
router.delete('/logout', async (req, res) => {
    try {
        const { token } = req.body;

        // Verifique se o token foi fornecido
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }

        // Exclua o token do banco de dados
        const result = await db.query('DELETE FROM tokens WHERE token = ?', [token]);

        // Verifique se o token foi excluído (nenhuma correspondência encontrada)
        if (result.affectedRows === 0) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        res.status(200).json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao processar a solicitação' });
    }
});

module.exports = router;
