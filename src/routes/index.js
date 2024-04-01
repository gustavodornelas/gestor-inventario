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


import ExibirColaboradores from '../pages/Colaboradores/Listar'
import CadastrarColaborador from '../pages/Colaboradores/Cadastrar';

import ExibirEmpresas from '../pages/Empresas/Listar';
import CadastrarEmpresa from '../pages/Empresas/Cadastrar';

import CadastrarEquipamento from '../pages/Equipamentos/Cadastrar';
import ExibirEquipamentos from '../pages/Equipamentos/Listar';


const AppRoutes = () => {

    const filiaisFormFields = [
        { name: "razao_social", label: "Razão Social", type: "text", required: true },
        { name: "cnpj", label: "CNPJ", type: "text", required: true },
        { name: "nome_fantasia", label: "Nome Fantasia", type: "text" },
        { name: 'id_empresa', label: "Empresa", type: "select", options: [], apiRoute: 'empresa', labelKey: "nome_fantasia" },
        { name: "inscricao_estadual", label: "Inscrição Estadual", type: "text" },
        { name: "inscricao_municipal", label: "inscricao Municipal", type: "text" },
        { name: "cep", label: "CEP", type: "text" },
        { name: "logradouro", label: "Logradouro", type: "text" },
        { name: "numero_endereco", label: "Número", type: "text" },
        { name: "complemento", label: "Complemento", type: "text" },
        { name: "bairro", label: "Bairro", type: "text" },
        { name: "cidade", label: "Cidade", type: "text" },
        { name: "estado", label: "Estado", type: "text" },
        { name: "telefone", label: "Telefone", type: "text" },
        { name: "email", label: "E-mail", type: "text" },
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
                        element={<ExibirEmpresas />} />
                </Route>
                <Route exact path="/empresas/cadastrar" element={<PrivateRoutes />} >
                    <Route
                        exact path='/empresas/cadastrar'
                        element={< CadastrarEmpresa />} />
                </Route>
                <Route exact path="/empresas/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route
                        exact path='/empresas/cadastrar/:id'
                        element={<CadastrarEmpresa />} />
                </Route>

                {/* Colaboradores */}
                <Route exact path="/colaboradores" element={<PrivateRoutes />} >
                    <Route
                        exact path='/colaboradores'
                        element={<ExibirColaboradores />} />
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
                        element={<ExibirEquipamentos />} />
                </Route>
                <Route exact path="/equipamentos/cadastrar" element={<PrivateRoutes />} >
                    <Route
                        exact path='/equipamentos/cadastrar'
                        element={<CadastrarEquipamento />} />
                </Route>
                <Route exact path="/equipamentos/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route
                        exact path='/equipamentos/cadastrar/:id'
                        element={<CadastrarEquipamento />} />
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