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

router.get('/', verificarToken, (req, res) => {
    const sql = 'SELECT * FROM equipamento';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

router.get('/resumo', verificarToken, (req, res) => {
    const sql = 'SELECT e.id, e.tipo_equipamento, e.nome, e.descricao, em.razao_social as empresa, f.razao_social as filial, c.nome as colaborador, e.situacao ' +
                'FROM equipamento as e ' + 
                'inner join empresa as em on e.id_empresa = em.id ' +
                'inner join filial_empresa as f on e.id_filial = f.id ' +
                'inner join colaborador as c on e.id_colaborador = c.id ';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});


// Buscar um equipamento
router.get('/:id', verificarToken, (req, res) => {

    const { id } = req.params;

    const sql = 'SELECT * FROM equipamento WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result[0]);
    });

});


// Cadastrar um novo equipamento
router.post('/', verificarToken, (req, res) => {
    console.log(req.body);

    const { tipo_equipamento, nome, descricao, id_empresa, id_filial, id_colaborador, data_inicial_colaborador, situacao, marca, modelo, numero_serie, metodo_aquisicao,
        data_aquisicao, numero_nota_fiscal, fornecedor, contrato, valor_equipamento, data_baixa, motivo_baixa, sistema_operacional, disco_SSD,
        memoria, processador } = req.body;

    const dataInicialColaborador = converterData(data_inicial_colaborador);
    const dataAquisicao = converterData(data_aquisicao);
    const dataBaixa = converterData(data_baixa);


    const sql = 'INSERT INTO equipamento (tipo_equipamento, nome, descricao, id_empresa, id_filial, id_colaborador, data_inicial_colaborador, situacao, marca, modelo, numero_serie, metodo_aquisicao, ' +
        'data_aquisicao, numero_nota_fiscal, fornecedor, contrato, valor_equipamento, data_baixa, motivo_baixa, sistema_operacional, disco_SSD, ' +
        'memoria, processador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [tipo_equipamento, nome, descricao, id_empresa, id_filial, id_colaborador, dataInicialColaborador, situacao, marca, modelo, numero_serie, metodo_aquisicao,
        dataAquisicao, numero_nota_fiscal, fornecedor, contrato, valor_equipamento, dataBaixa, motivo_baixa, sistema_operacional, disco_SSD,
        memoria, processador], (err) => {
            if (err) {
                console.log('Erro: ' + err);
                res.status(500).send('Erro ao cadastrar o equipamento');
            } else {
                res.send('Equipamento cadastrado com sucesso');
            }
        })
});

// Atualizar um equipamento
router.put('/:id', verificarToken, (req, res) => {
    const { id } = req.params;
    const { tipo_equipamento, nome, descricao, id_empresa, id_filial, id_colaborador, data_inicial_colaborador, situacao, marca, modelo, numero_serie, metodo_aquisicao,
        data_aquisicao, numero_nota_fiscal, fornecedor, contrato, valor_equipamento, data_baixa, motivo_baixa, sistema_operacional, disco_SSD,
        memoria, processador } = req.body;

    const dataInicialColaborador = converterData(data_inicial_colaborador);
    const dataAquisicao = converterData(data_aquisicao);
    const dataBaixa = converterData(data_baixa);

    const sql = 'UPDATE equipamento SET tipo_equipamento = ?, nome = ?, descricao = ?, id_empresa = ?, id_filial = ?, id_colaborador = ?, data_inicial_colaborador = ?, situacao = ?, marca = ?, modelo = ?, numero_serie = ?, metodo_aquisicao = ?, ' +
    'data_aquisicao  = ?, numero_nota_fiscal  = ?, fornecedor = ?, contrato = ?, valor_equipamento = ?, data_baixa = ?, motivo_baixa = ?, sistema_operacional = ?, disco_SSD = ?, ' + 
    'memoria = ?, processador = ? where ID = ?';
    db.query(sql, [tipo_equipamento, nome, descricao, id_empresa, id_filial, id_colaborador, dataInicialColaborador, situacao, marca, modelo, numero_serie, metodo_aquisicao,
        dataAquisicao, numero_nota_fiscal, fornecedor, contrato, valor_equipamento, dataBaixa, motivo_baixa, sistema_operacional, disco_SSD,
        memoria, processador, id], (err) => {
            if (err) {
                console.log('Erro: ' + err);
                res.status(500).send('Erro ao atualizar o equipamento');
            } else {
                res.send('Equipamento atualizado com sucesso');
            }
        })
});

// Deletar um equipamento
router.delete('/:id', verificarToken, (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM equipamento WHERE ID = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.log('Erro: ' + err);
            res.status(500).send('Erro ao deletar o equipamento');
        } else {
            res.send('Equipamento deletado com sucesso');
        }
    })
});

module.exports = router;