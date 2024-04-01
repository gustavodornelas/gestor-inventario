import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import Tabela from "../../../components/Tabela";
import { ConfirmToast } from "../../../components/customToasts";
import api from "../../../services/api";

export default function ExibirEmpresas() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = () => {
        api
            .get('empresa/resumo')
            .then((res) => {
                setEmpresas(res.data);
            })
            .catch((err) => {
                toast.error(err.response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleEdit = (id) => {
        navigate(`/empresas/cadastrar/${id}`);
    };

    const handleAdd = () => {
        navigate(`/empresas/cadastrar`);
    };

    const deleteItem = async (id) => {
        try {
            const res = await api.delete(`/empresa/${id}`);
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteItems = async (items) => {
        console.log(items)
        const deletePromises = items.map(async (item) => {
            try {
                const res = await deleteItem(item.id);
                return { success: true, name: item.nome, message: res };
            } catch (err) {
                return { success: false, name: item.nome, message: err.response.data };
            }
        });

        const results = await Promise.all(deletePromises);

        const successfulDeletes = results.filter((result) => result.success);
        const failedDeletes = results.filter((result) => !result.success);

        successfulDeletes.forEach((item) => toast.success(`${item.name}: ${item.message}`));
        failedDeletes.forEach((item) => toast.error(`${item.name}: ${item.message}`));

        setLoading(true);
        fetchData();
    };

    const handleDelete = async (ids) => {
        const itemsToDelete = await empresas.filter((item) => ids.includes(item.id));

        const confirmationMessage = `Deseja realmente deletar as Empresas selecionadas?`;

        toast(
            <ConfirmToast
                message={confirmationMessage}
                onConfirm={async () => {
                    deleteItems(itemsToDelete);
                }}
            />,
            {
                autoClose: false,
                draggable: false,
            }
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <Tabela dados={empresas} titulo={'Empresas'} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
    );
};