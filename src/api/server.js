const express = require('express'), bodyParser = require('body-parser');;
const cors = require('cors');
const empresaRoutes = require('./routes/empresa');
const filialRoutes = require('./routes/filial_empresa');
const colaboradorRoutes = require('./routes/colaborador');
const equipamentoRoutes = require('./routes/equipamento');
const autenticacaoRoutes = require('./routes/autenticacao');

const app = express();
const port = 5000;

// Adicionando middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Use as rotas
app.use('/api/empresa', empresaRoutes);
app.use('/api/filial', filialRoutes);
app.use('/api/colaborador', colaboradorRoutes);
app.use('/api/equipamento', equipamentoRoutes);
app.use('/api/autenticacao', autenticacaoRoutes);


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});