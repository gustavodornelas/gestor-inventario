// src/api/routes/empresas.js
const express = require('express');
const router = express.Router();
const db = require('../database'); // Supondo que você tenha um arquivo para a conexão com o banco de dados
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

// Listar todas as empresas
router.get('/', verificarToken, (req, res) => {
        const sql = 'SELECT * FROM empresa';
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result);
        });
});

router.get('/resumo', verificarToken, (req, res) => {
    const sql = 'SELECT id, nome_fantasia as nome, cnpj, inscricao_estadual from empresa';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

// Listar uma empresa
router.get('/:id', verificarToken, (req, res) => {

    const { id } = req.params;
    
    const sql = 'SELECT * FROM empresa WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result[0]);
    });

});

// Cadastrar uma nova empresa
router.post('/', verificarToken, (req, res) => {
    console.log(req.body);
    const { razao_social, cnpj, nome_fantasia, inscricao_estadual, inscricao_municipal } = req.body;

    const sql = 'INSERT INTO empresa (razao_social, cnpj, nome_fantasia, inscricao_estadual, inscricao_municipal) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [razao_social, cnpj, nome_fantasia, inscricao_estadual, inscricao_municipal ], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao cadastrar a empresa');
        } else {
            res.send('Empresa cadastrada com sucesso');
        }
    })
});

// Atualizar uma empresa
router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { razao_social, cnpj, nome_fantasia, inscricao_estadual, inscricao_municipal } = req.body;

    const sql = 'UPDATE empresa SET razao_social = ?, cnpj = ?, nome_fantasia = ?, inscricao_estadual = ?, inscricao_municipal = ? where ID = ?';
    db.query(sql, [ razao_social, cnpj, nome_fantasia, inscricao_estadual, inscricao_municipal, id ], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao atualizar a empresa');
        } else {
            res.send('Empresa atualizada com sucesso');
        }
    })
});

// Deletar uma empresa
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    // Verificar se a empresa possui filiais
    const verificarFiliaisSql = 'SELECT COUNT(*) AS filiaisCount FROM filial_empresa WHERE id_empresa = ?';
    db.query(verificarFiliaisSql, [id], (err, result) => {
        if (err) {
            console.log('Erro ao verificar filiais: ' + err);
            res.status(500).send('Erro ao verificar filiais da empresa');
            return;
        }

        const filiaisCount = result[0].filiaisCount;

        // Se a empresa tiver filiais, retorne um erro
        if (filiaisCount > 0) {
            res.status(400).send('Não é possível excluir a empresa, pois ela possui filiais associadas.');
            return;
        }

        // Se a empresa não tiver filiais, continue com a exclusão
        const deleteEmpresaSql = 'DELETE FROM empresa WHERE ID = ?';
        db.query(deleteEmpresaSql, [id], (err, result) => {
            if (err) {
                console.log('Erro ao deletar a empresa: ' + err);
                res.status(500).send('Erro ao deletar a empresa');
            } else {
                res.send('Empresa deletada com sucesso');
            }
        });
    });
});

module.exports = router;