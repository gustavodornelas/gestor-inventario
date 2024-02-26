import { createContext, useEffect, useState } from "react";
import api from "../services/api";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const loadingStorageData = async () => {
            const storageUsuario = localStorage.getItem("@Auth:user");
            const storageToken = localStorage.getItem("@Auth:token");

            if (storageUsuario && storageToken) {
                setUsuario(storageUsuario);
                api.defaults.headers.common[
                    "Authorization"
                ] = storageToken;
            }
        }
        loadingStorageData();

    }, [usuario]);

    const signIn = async ({ usuario, senha }) => {
        try {
            const response = await api.post("/autenticacao/login", {
                usuario,
                senha,
            });


            setUsuario(response.data);

            localStorage.setItem("@Auth:token", response.data.token);
            localStorage.setItem("@Auth:user", JSON.stringify(response.data.usuario));
            toast.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Se a resposta for 401, exibir a mensagem de erro da API
                toast.error(error.response.data.message);
            } else {
                // Outros erros podem ser tratados aqui
                console.error("Erro ao autenticar:", error.message);
            }
        }
    };


    const signOut = () => {
        localStorage.clear();
        setUsuario(null);

        return < Navigate to='/' />
    }

    return (
        <AuthContext.Provider value={{
            usuario,
            signIn,
            signOut,
            signed: !!usuario,
        }}>
            {children}
        </AuthContext.Provider>
    )
}