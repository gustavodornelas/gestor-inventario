import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';

import Home from "../pages/home";

import Login from '../pages/login';
import { PrivateRoutes } from './privateRoutes';
import Exibir from '../pages/Exibir';
import Cadastrar from '../pages/Cadastrar';
import ListarColaboradores from '../pages/Colaboradores/Listar'
import CadastrarColaborador from '../pages/Colaboradores/Cadastrar';


const AppRoutes = () => {

    const empresasFormFields = [
        { name: "razao_social", label: "Razão Social", type: "text", required: true },
        { name: "cnpj", label: "CNPJ", type: "text", required: true },
        { name: "nome_fantasia", label: "Nome Fantasia", type: "text"},
        { name: "inscricao_estadual", label: "Inscrição Estadual", type: "text"},
        { name: "inscricao_municipal", label: "inscricao Municipal", type: "text"}
    ];

    const EquipamentosFormFields = [
        { name: "tipo_equipamento", label: "Tipo de Equipamento", type: "text" },
        { name: "nome", label: "Nome", type: "text" },
        { name: "descricao", label: "Descrição", type: "text"},
        { name: "id_empresa", label: "Empresa", type: "select", options: [], apiRoute: "empresa", labelKey: "nome_fantasia"},
        { name: "id_filial", label: "Filial", type: "select", options: [], apiRoute: "filial", labelKey: "nome_fantasia"},
        { name: "id_colaborador", label: "Colaborador", type: "select", options: [], apiRoute: "colaborador", labelKey: "nome"},
        { name: "data_inicial_colaborador", label: "Data inicial do Colaborador", type: "datepicker", minDateField: 'data_aquisicao' },
        { name: "situacao", label: "Situação", type: "text" },
        { name: "data_aquisicao", label: "Data da Aquisição", type: "datepicker" },
        { name: "metodo_aquisicao", label: "Metódo da Aquisição", type: "text" },
        { name: "numero_nota_fiscal", label: "Número da Nota Fiscal", type: "text" },
        { name: "fornecedor", label: "Fornecedor", type: "text" },
        { name: "contrato", label: "Contrato", type: "text" },
        { name: "valor_equipamento", label: "Valor do Equipamento", type: "text" },
        { name: "data_baixa", label: "Data da Baixa", type: "datepicker", minDateField: 'data_aquisicao' },
        { name: "motivo_baixa", label: "Motivo da Baixa", type: "text" },
        { name: "marca", label: "Marca", type: "text" },
        { name: "modelo", label: "Modelo", type: "text" },
        { name: "numero_serie", label: "Número de Série", type: "text" },
        { name: "sistema_operacional", label: "Sistema Operacional", type: "text" },
        { name: "disco_SSD", label: "Disco / SSD", type: "text" },
        { name: "memoria", label: "Memoria", type: "text" },
        { name: "processador", label: "Processador", type: "text" }
    ];


    const filiaisFormFields = [
        { name: "razao_social", label: "Razão Social", type: "text", required: true },
        { name: "cnpj", label: "CNPJ", type: "text", required: true },
        { name: "nome_fantasia", label: "Nome Fantasia", type: "text" },
        { name: 'id_empresa', label: "Empresa", type: "select", options: [], apiRoute: 'empresa', labelKey: "nome_fantasia" },
        { name: "inscricao_estadual", label: "Inscrição Estadual", type: "text" },
        { name: "inscricao_municipal", label: "inscricao Municipal", type: "text" },
        { name: "cep", label: "CEP", type: "text"},
        { name: "logradouro", label: "Logradouro", type: "text"},
        { name: "numero_endereco", label: "Número", type: "text"},
        { name: "complemento", label: "Complemento", type: "text"},
        { name: "bairro", label: "Bairro", type: "text" },
        { name: "cidade", label: "Cidade", type: "text" },
        { name: "estado", label: "Estado", type: "text" },
        { name: "telefone", label: "Telefone", type: "text" },
        { name: "email", label: "E-mail", type: "text"},
    ];

    
    return (
        <Router>
            <Routes>

                {/* Login */}
                <Route exact path='/' element={<Login />} />

                {/* Home */}
                <Route exact path="/home" element={<PrivateRoutes />} >
                    <Route exact path='/home' element={<Home />} />
                </Route>

                {/* Empresas */}
                <Route exact path="/empresas" element={<PrivateRoutes />} >
                    <Route 
                        exact path='/empresas' 
                        element={<Exibir title="empresas" apiRoute="empresa/resumo" />} />
                </Route>
                <Route exact path="/empresas/cadastrar" element={<PrivateRoutes />} >
                    <Route 
                        exact path='/empresas/cadastrar' 
                        element={< Cadastrar title="empresas" apiRoute="empresa" formFields={empresasFormFields} />} />
                </Route>
                <Route exact path="/empresas/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route 
                        exact path='/empresas/cadastrar/:id' 
                        element={<Cadastrar title="empresas" apiRoute="empresa" formFields={ empresasFormFields } />} />
                </Route>

                {/* Colaboradores */}
                <Route exact path="/colaboradores" element={<PrivateRoutes />} >
                    <Route
                        exact path='/colaboradores'
                        element={<ListarColaboradores />} />
                </Route>

                <Route exact path="/colaboradores/cadastrar" element={<PrivateRoutes />} >
                    <Route
                        exact path='/colaboradores/cadastrar'
                        element={<CadastrarColaborador />} />
                </Route>
                <Route exact path="/colaboradores/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route
                        exact path='/colaboradores/cadastrar/:id'
                        element={<CadastrarColaborador />} />
                </Route>

                {/* Equipamentos */}
                <Route exact path="/equipamentos" element={<PrivateRoutes />} >
                    <Route
                        exact path='/equipamentos'
                        element={<Exibir title="equipamentos" apiRoute="equipamento" />} />
                </Route>
                <Route exact path="/equipamentos/cadastrar" element={<PrivateRoutes />} >
                    <Route
                        exact path='/equipamentos/cadastrar'
                        element={<Cadastrar title='equipamentos'apiRoute="equipamento" formFields={EquipamentosFormFields} />} />
                </Route>
                <Route exact path="/equipamentos/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route
                        exact path='/equipamentos/cadastrar/:id'
                        element={<Cadastrar title="equipamentos" apiRoute="equipamento" formFields={EquipamentosFormFields} />} />
                </Route>

                {/* Filiais */}
                <Route exact path="/filiais" element={<PrivateRoutes />} >
                    <Route
                        exact path='/filiais'
                        element={<Exibir title="filiais" apiRoute="filial" />} />
                </Route>

                <Route exact path="/filiais/cadastrar" element={<PrivateRoutes />} >
                    <Route
                        exact path='/filiais/cadastrar'
                        element={<Cadastrar title="filiais" apiRoute="filial" formFields={filiaisFormFields} />} />
                </Route>
                <Route exact path="/filiais/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route
                        exact path='/filiais/cadastrar/:id'
                        element={<Cadastrar title="filiais" apiRoute="filial" formFields={filiaisFormFields} />} />
                </Route>

            </Routes>
        </Router>
    )
}

export default AppRoutes;