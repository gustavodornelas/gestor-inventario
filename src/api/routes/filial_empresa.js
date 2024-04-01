// src/api/routes/empresas.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const verificarToken = require('./verificarToken');

function converterData(data) {
    if (data !== "" && data !== null) {
        const dataConvertida = new Date(data);

        if (isNaN(dataConvertida.getTime())) {
            // Se a conversão falhar, retorne null
            return null;
        }

        // Formate a data no formato adequado para o MySQL (AAAA-MM-DD HH:mm:ss)
        const ano = dataConvertida.getFullYear();
        const mes = ('00' + (dataConvertida.getMonth() + 1)).slice(-2);
        const dia = ('00' + dataConvertida.getDate()).slice(-2);
        const horas = ('00' + dataConvertida.getHours()).slice(-2);
        const minutos = ('00' + dataConvertida.getMinutes()).slice(-2);
        const segundos = ('00' + dataConvertida.getSeconds()).slice(-2);

        const dataFormatada = `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        return dataFormatada;
    } else {
        return null;
    }
}

// Listar todas as filiais
router.get('/', verificarToken, (req, res) => {
    const sql = 'SELECT * from filial_empresa';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// Listar todas as filiais
router.get('/resumo', verificarToken, (req, res) => {
    const sql = 'SELECT f.id, f.nome_fantasia as nome, e.nome_fantasia as empresa, f.cnpj, f.cidade, f.telefone ' +
                'from filial_empresa as f ' +
                'inner join empresa as e on f.id_empresa = e.id';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// Listar uma unica filial
router.get('/:id', verificarToken, (req, res) => {

    const { id } = req.params;

    const sql = 'SELECT * FROM filial_empresa WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result[0]);
    });
});


// Cadastrar uma nova filial
router.post('/', verificarToken, (req, res) => {
    console.log(req.body);
    const {
        razao_social,
        cnpj,
        nome_fantasia,
        id_empresa,
        inscricao_estadual,
        inscricao_municipal,
        cep,
        logradouro,
        numero_endereco,
        complemento,
        bairro,
        cidade,
        estado,
        telefone,
        email
    } = req.body;

    const sql = `INSERT INTO filial_empresa 
    (razao_social, cnpj, nome_fantasia, id_empresa, inscricao_estadual, inscricao_municipal, cep, logradouro, 
    numero_endereco, complemento, bairro, cidade, estado, telefone, email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        razao_social,
        cnpj,
        nome_fantasia,
        id_empresa,
        inscricao_estadual,
        inscricao_municipal,
        cep,
        logradouro,
        numero_endereco,
        complemento,
        bairro,
        cidade,
        estado,
        telefone,
        email
    ], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao cadastrar a filial da empresa');
        } else {
            res.send('Filial da empresa cadastrada com sucesso');
        }
    });
});

// Atualizar uma empresa
router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const {
        razao_social,
        cnpj,
        nome_fantasia,
        id_empresa,
        inscricao_estadual,
        inscricao_municipal,
        cep,
        logradouro,
        numero_endereco,
        complemento,
        bairro,
        cidade,
        estado,
        telefone,
        email
    } = req.body;

    const sql = `UPDATE filial_empresa SET 
    razao_social = ?, cnpj = ?, nome_fantasia = ?, id_empresa = ?, inscricao_estadual = ?, inscricao_municipal = ?, cep = ?, 
    logradouro = ?, numero_endereco = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, telefone = ?, email = ? 
    WHERE id = ?`;

    db.query(sql, [
        razao_social,
        cnpj,
        nome_fantasia,
        id_empresa,
        inscricao_estadual,
        inscricao_municipal,
        cep,
        logradouro,
        numero_endereco,
        complemento,
        bairro,
        cidade,
        estado,
        telefone,
        email,
        id
    ], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao atualizar a filial da empresa');
        } else {
            res.send('Filial da empresa atualizada com sucesso');
        }
    });
});

// Deletar uma filial de empresa
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    // Verificar se a filial possui colaboradores
    const checkColaboradoresSql = 'SELECT COUNT(*) AS colaboradoresCount FROM colaborador WHERE id_filial = ?';
    db.query(checkColaboradoresSql, [id], (err, result) => {
        if (err) {
            console.log('Erro ao verificar colaboradores: ' + err);
            res.status(500).send('Erro ao verificar colaboradores da filial da empresa');
            return;
        }

        const colaboradoresCount = result[0].colaboradoresCount;

        // Se a filial tiver colaboradores, retorne um erro
        if (colaboradoresCount > 0) {
            res.status(400).send('Não é possível excluir a filial, pois ela possui colaboradores vinculados.');
            return;
        }

        // Se a filial não tiver colaboradores, continue com a exclusão
        const deleteFilialSql = 'DELETE FROM filial_empresa WHERE id = ?';
        db.query(deleteFilialSql, [id], (deleteErr) => {
            if (deleteErr) {
                console.log('Erro ao deletar a filial da empresa: ' + deleteErr);
                res.status(500).send('Erro ao deletar a filial da empresa');
            } else {
                res.send('Filial da empresa deletada com sucesso');
            }
        });
    });
});


module.exports = router;