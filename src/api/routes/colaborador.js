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

// Listar todos os colaboradores
router.get('/', verificarToken, (req, res) => {
    const sql = 'SELECT * FROM colaborador';
    db.query(sql, (err, result) => {
        
        if (err) throw err;
        
        res.json(result);
    });
});

// Listagem resumida de todos os colaboradores
router.get('/resumo', verificarToken, (req, res) => {
    const sql = "SELECT c.id, c.nome, c.cpf, c.cargo, c.setor, e.razao_social AS empresa, f.razao_social AS filial, " +
    "CASE WHEN c.data_desligamento IS NULL THEN 'Ativo' ELSE 'Inativo' END AS status " +
    "FROM colaborador  c LEFT JOIN empresa e ON c.id_empresa = e.id LEFT JOIN filial_empresa f ON id_filial = f.id; ";
    db.query(sql, (err, result) => {

        if (err) throw err;

        res.json(result);
    });
});

// Buscar um colaborador
router.get('/:id', verificarToken, (req, res) => {

    const { id } = req.params;

    const sql = 'SELECT * FROM colaborador WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result[0]);
        res.json(result[0]);
    });

});

// Cadastrar um colaborador
router.post('/', verificarToken, (req, res) => {
    console.log(req.body);
    const { nome, cpf, cargo, setor, sexo, data_nascimento, id_empresa, id_filial, telefone, ramal, data_integracao, data_desligamento } = req.body;

    const dataNascimento = converterData(data_nascimento);
    const dataIntegracao = converterData(data_integracao);
    const dataDesligamento = converterData(data_desligamento);

    const sql = 'INSERT INTO colaborador (nome, cpf, cargo, setor, sexo, data_nascimento, id_empresa, id_filial, telefone, ramal, data_integracao, data_desligamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, cpf, cargo, setor, sexo, dataNascimento, id_empresa, id_filial, telefone, ramal, dataIntegracao, dataDesligamento], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao cadastrar o(a) colaborador(a)');
        } else {
            res.send('Colaborador(a) ' + nome +  ' cadastrado(a) com sucesso');
        }
    })
});

// Atualizar um colaborador
router.put('/:id', verificarToken, (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { nome, cpf, cargo, setor, sexo, data_nascimento, id_empresa, id_filial, telefone, ramal, data_integracao, data_desligamento } = req.body;

    const dataNascimento = converterData(data_nascimento);
    const dataIntegracao = converterData(data_integracao);
    const dataDesligamento = converterData(data_desligamento);

    const sql = 'UPDATE colaborador SET nome = ?, cpf = ?, cargo = ?, setor = ?, sexo = ?, data_nascimento = ?, id_empresa = ?, id_filial = ?, telefone = ?, ramal = ?, data_integracao = ?, data_desligamento = ? where ID = ?';
    db.query(sql, [nome, cpf, cargo, setor, sexo, dataNascimento, id_empresa, id_filial, telefone, ramal, dataIntegracao, dataDesligamento, id], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao atualizar o(a) colaborador(a)');
        } else {
            res.send('Colaborador(a) ' + nome +  ' atualizado(a) com sucesso');
        }
    })
});

// Deletar um colaborador
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    // Verificar se o colaborador possui equipamentos vinculados a ele
    const checkEquipamentosSql = 'SELECT COUNT(*) AS equipamentosCount FROM equipamento WHERE id_colaborador = ?';
    db.query(checkEquipamentosSql, [id], (err, result) => {
        if (err) {
            console.log('Erro ao verificar equipamentos: ' + err);
            res.status(500).send('Erro ao verificar equipamentos do colaborador');
            return;
        }

        const equipamentosCount = result[0].equipamentosCount;

        // Se a filial tiver colaboradores, retorne um erro
        if (equipamentosCount > 0) {
            res.status(400).send('Não é possível excluir o(a) colaborador(a), pois o(a) mesmo possui equipamentos vinculados.');
            return;
        }

        // Se a filial não tiver colaboradores, continue com a exclusão
        const deleteColaboradorSql = 'DELETE FROM colaborador WHERE id = ?';
        db.query(deleteColaboradorSql, [id], (deleteErr) => {
            if (deleteErr) {
                console.log('Erro ao deletar o colaborador: ' + deleteErr);
                res.status(500).send('Erro ao deletar o(a) colaborador(a)!');
            } else {
                res.send('Colaborador(a) deletado(a) com sucesso');
            }
        });
    });
});

module.exports = router;