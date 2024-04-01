import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';

import Home from "../pages/home";

import Login from '../pages/login';
import { PrivateRoutes } from './privateRoutes';

import ExibirColaboradores from '../pages/Colaboradores/Listar'
import CadastrarColaborador from '../pages/Colaboradores/Cadastrar';

import ExibirEmpresas from '../pages/Empresas/Listar';
import CadastrarEmpresa from '../pages/Empresas/Cadastrar';

import CadastrarEquipamento from '../pages/Equipamentos/Cadastrar';
import ExibirEquipamentos from '../pages/Equipamentos/Listar';

import CadastrarFilial from '../pages/Filiais/Cadastrar';
import ExibirFiliais from '../pages/Filiais/Listar';


const AppRoutes = () => {

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
                        element={<ExibirFiliais />} />
                </Route>

                <Route exact path="/filiais/cadastrar" element={<PrivateRoutes />} >
                    <Route
                        exact path='/filiais/cadastrar'
                        element={<CadastrarFilial />} />
                </Route>
                <Route exact path="/filiais/cadastrar/:id" element={<PrivateRoutes />} >
                    <Route
                        exact path='/filiais/cadastrar/:id'
                        element={<CadastrarFilial />} />
                </Route>

            </Routes>
        </Router>
    )
}

export default AppRoutes;