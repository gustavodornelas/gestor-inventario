import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import api from "../../services/api";
import { ConfirmToast } from "../../components/customToasts";
import Loading from "../../components/Loading";
import { StyledDatePicker, StyledFooter, StyledForm, StyledGroup, StyledLabel, StyledOption, StyledSelect, StyledButton, StyledInput, StyledFormBody } from "../../style/formStyles";

export default function Cadastrar({ title, apiRoute, formFields }) {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSelects, setLoadingSelects] = useState(true);

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const initialFormData = formFields.reduce(async (acc, field) => {
        acc[field.name] = "";

        if (field.type === "select") {
            await api.get(`/${field.apiRoute}`)
                .then(response => {
                    field.options = response.data;
                })
                .catch(err => {
                    toast.error(err.response.data)
                })
                .finally(() => {
                    // Setando o estado loadingSelects como false após o carregamento do select
                    setLoadingSelects(false);
                });
        }

        return acc;
    }, {});

    const [formData, setFormData] = useState(initialFormData);
    const [editingId, setEditingId] = useState(null);
    const { id } = useParams(); // Recupera o id da URL
    const navigate = useNavigate();

    // Verificando se há algum campo do tipo "select", caso contrário, seta loadingSelects como false
    useEffect(() => {
        if (!formFields.some(field => field.type === "select")) {
            setLoadingSelects(false);
        }
    }, [formData, formFields]);

    useEffect(() => {
        if (id) {
            api.get(`${apiRoute}/${id}`)
                .then(async (response) => {
                    const dados = response.data;

                    const todasAsChaves = Object.keys(dados);
                    const chavesComData = todasAsChaves.filter((chave) =>
                        chave.includes('data')
                    );

                    if (chavesComData.length > 0) {
                        await Promise.all(
                            chavesComData.map(async (chaveComData) => {
                                if (dados[chaveComData]) {
                                    dados[chaveComData] = await converterData(dados[chaveComData]);
                                }
                            })
                        );
                    }

                    setItem(response.data);
                    setEditingId(id);
                })
                .catch((err) => {
                    setLoading(false); // Indica que ocorreu um erro ao carregar os dados
                    console.log(err);
                    toast.error("Ops! Ocorreu um erro", err);
                });
        } else {
            setLoading(false);
        }
    }, [id, editingId, apiRoute]);


    useEffect(() => {
        if (editingId) {
            const newFormData = {};
            formFields.forEach((field) => {
                newFormData[field.name] = item[field.name];
            });
            setFormData(newFormData);
            setLoading(false);
        }
    }, [editingId, item, formFields]);

    const converterData = (dataString) => {
        if (dataString) {
            const dataObj = parseISO(dataString);
            return new Date(dataObj);
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar se está em modo de edição ou cadastro
        if (editingId !== null) {
            // Modo de edição
            await api.put(`/${apiRoute}/` + id, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/${title}`);
                })
                .catch(err => toast.error(err.response.data))
        } else {
            // Modo de cadastro
            await api.post(`/${apiRoute}/`, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/${title}`);
                })
                .catch(err => toast.error(err.response.data))
        }
    };

    const deleteItem = () => {
        api.delete(`/${apiRoute}/` + editingId).then((res) => {
            toast.success(res.data);
            navigate(`/${title}`);
        })
            .catch(err => toast.error(err.response.data))
    }

    const handleDelete = () => {
        const msg = `Deseja realmente deletar o(a) ${apiRoute} ` + item.nome + "?";

        toast.dismiss();
        toast(<ConfirmToast message={msg} onConfirm={deleteItem} />, {
            autoClose: false,
            draggable: false,
        });

    };


    if (loading) {
        return <Loading />;
    }

    if (loadingSelects) {
        return <Loading />;
    }

    return (
        <>
            <h2> Cadastro de {capitalizeFirstLetter(title)} </h2>
            <StyledForm onSubmit={handleSubmit}>
                <StyledFormBody>
                    {formFields.map(field => (
                        <StyledGroup key={field.name}>
                            <StyledLabel>{field.label}</StyledLabel>
                            {field.type === "select" ? (
                                <StyledSelect
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    required={field.required}
                                >
                                    <StyledOption value="" disabled hidden selected={editingId ? false : true} />
                                    {field.options.map(option => (
                                        <StyledOption key={option.id} value={option.id}>
                                            {option[field.labelKey]}
                                        </StyledOption>
                                    ))}
                                </StyledSelect>
                            ) : field.type === "datepicker" ? (
                                <StyledDatePicker
                                    name={field.name}
                                    value={formData[field.name]}
                                    selected={formData[field.name]}
                                    onChange={date => handleDateChange(date, field.name)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText={field.label}
                                    isClearable
                                    showYearDropdown
                                    showMonthDropdown
                                    minDate={field.minDateField ? formData[field.minDateField] : null}
                                    autoComplete="off"
                                />
                            ) : (
                                <StyledInput
                                    name={field.name}
                                    value={formData[field.name]}
                                    type={field.type}
                                    placeholder={field.label}
                                    onChange={handleInputChange}
                                    required={field.required}
                                />
                            )}
                        </StyledGroup>
                    ))}
                </StyledFormBody>
                <StyledFooter>
                    <StyledButton type="submit">
                        {editingId !== null ? `Editar ${apiRoute}` : `Cadastrar ${apiRoute}`}
                    </StyledButton>
                    <StyledButton color="secondary" type="button" disabled={editingId === null} onClick={handleDelete}>
                        Deletar {apiRoute}
                    </StyledButton>
                </StyledFooter>
            </StyledForm>
        </>
    );
}