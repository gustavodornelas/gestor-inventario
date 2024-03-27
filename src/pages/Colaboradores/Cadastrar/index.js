import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import api from "../../../services/api"
import { ConfirmToast } from "../../../components/customToasts"
import Loading from "../../../components/Loading"
import { StyledDatePicker, StyledFooter, StyledForm, StyledGroup, StyledLabel, StyledOption, StyledSelect, StyledButton, StyledInput, StyledFormBody, StyledFormatedNumber } from "../../../style/formStyles"
import { converterData } from "../../../services/formUtils"

export default function CadastrarColaborador() {
    const { id } = useParams() // Recupera o id da URL
    const [loading, setLoading] = useState(true)
    const [loadingSelects, setLoadingSelects] = useState(true)
    const [colaborador, setColaborador] = useState(null)
    const [empresas, setEmpresas] = useState([])
    const [filiais, setFiliais] = useState([])
    const [filiaisFiltradas, setFiliaisFiltradas] = useState([]);
    const [formData, setFormData] = useState({})

    const navigate = useNavigate()

    const colaboradoresFormFields = [
        { name: "nome", label: "Nome", type: "text", required: true },
        { name: "cpf", label: "CPF", type: "formatedNumber", mask: "###.###.###-##", required: true },
        { name: "id_empresa", label: "Empresa", type: "select", options: empresas, labelKey: "nome_fantasia" },
        { name: "id_filial", label: "Filial", type: "select", options: filiaisFiltradas, labelKey: "nome_fantasia", filter: formData.id_empresa },
        { name: "cargo", label: "Cargo", type: "text" },
        { name: "setor", label: "Setor", type: "text" },
        { name: "sexo", label: "Sexo", type: "text" },
        { name: "data_nascimento", label: "Data de Nascimento", type: "date" },
        { name: "telefone", label: "Telefone", type: "formatedNumber", mask: "(##) ####-####", maskLength: "15" },
        { name: "ramal", label: "Ramal", type: "text" },
        { name: "data_integracao", label: "Data de Integração", type: "date", minDate: formData.data_nascimento },
        { name: "data_desligamento", label: "Data de Desligamento", type: "date", minDate: formData.data_integracao }
    ]

    // Carregando as empresas e filiais para o Select
    useEffect(() => {
        Promise.all([
            api.get('empresa'),
            api.get('filial')
        ])
            .then(([empresaResponse, filialResponse]) => {
                setEmpresas(empresaResponse.data);
                setFiliais(filialResponse.data);
                setLoadingSelects(false);
            })
            .catch(error => {
                toast.error(error);
            });
    }, []);

    useEffect(() => {
        // Filtrar as filiais quando o formData.id_empresa mudar
        // eslint-disable-next-line eqeqeq
        const filtro = filiais.filter(filial => filial.id_empresa == formData.id_empresa);
        setFiliaisFiltradas(filtro);

    }, [formData.id_empresa, filiais]);

    // Carregando os Colaboradores em caso de edição
    useEffect(() => {
        if (id) {
            api.get('colaborador/' + id)
                .then(async response => {
                    const dados = response.data

                    const todasAsChaves = Object.keys(dados)
                    const chavesComData = todasAsChaves.filter((chave) =>
                        chave.includes('data')
                    )


                    // Convertendo dadas para o formato do campo
                    if (chavesComData.length > 0) {
                        await Promise.all(
                            chavesComData.map(async (chaveComData) => {
                                if (dados[chaveComData]) {
                                    dados[chaveComData] = await converterData(dados[chaveComData])
                                }
                            })
                        )
                    }

                    setColaborador(dados)
                })
                .catch(error => {
                    toast.error(error.message)
                })
        } else {
            setLoading(false)
        }
    }, [id])

    // Preenchendo os campos do formulário com os dados em caso de edição
    useEffect(() => {
        if (colaborador) {
            const newFormData = {}
            colaboradoresFormFields.forEach((field) => {
                newFormData[field.name] = colaborador[field.name]
            })
            setFormData(newFormData)
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colaborador])


    // Funções de controle de Formulário
    function handleInputChange(e) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date })
        console.log(formData)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.id_empresa) {
            formData.id_filial = null;
        }

        // Verificar se está em modo de edição ou cadastro
        if (colaborador !== null) {
            // Modo de edição
            await api.put(`/colaborador/` + id, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/colaboradores`)
                })
                .catch(err => toast.error(err.response.data))
        } else {
            // Modo de cadastro
            await api.post(`/colaborador/`, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/colaboradores`)
                })
                .catch(err => toast.error(err.response.data))
        }
    }

    const deleteItem = () => {
        api.delete(`/colaborador/` + id).then((res) => {
            toast.success(res.data)
            navigate(`/colaboradores`)
        })
            .catch(err => toast.error(err.response.data))
    }

    const handleDelete = () => {
        const msg = `Deseja realmente deletar o(a) Colaborador ` + colaborador.nome + "?"

        toast.dismiss()
        toast(<ConfirmToast message={msg} onConfirm={deleteItem} />, {
            autoClose: false,
            draggable: false,
        })
    }

    if (loading || loadingSelects) {
        return <Loading />
    }

    return (
        <>
            <h2> Cadastro de Colaborador </h2>
            <StyledForm onSubmit={handleSubmit}>
                <StyledFormBody>
                    {colaboradoresFormFields.map(field => (
                        <StyledGroup key={field.name}>
                            <StyledLabel>
                                {field.label}
                                {field.required ? (" *") : ("")}
                            </StyledLabel>

                            {field.type === "select" ? (

                                <StyledSelect
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    // eslint-disable-next-line eqeqeq
                                    disabled={field.options == 0 ? true : false}
                                >
                                    <StyledOption value="" disabled hidden selected={
                                        colaborador ? (
                                            colaborador[field.name] ? false : true
                                        ) : (
                                            true
                                        )
                                    } />
                                    {field.options.map(option => (
                                        // eslint-disable-next-line eqeqeq
                                        <StyledOption key={option.id} value={option.id} selected={option.id == field.name ? field.name : false}>
                                            {option[field.labelKey]}
                                        </StyledOption>
                                    ))}
                                </StyledSelect>

                            ) : field.type === "date" ? (
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
                                    minDate={field.minDate}
                                    autoComplete="off"
                                />

                            ) : field.type === "formatedNumber" ? (
                                <StyledFormatedNumber
                                    name={field.name}
                                    value={formData[field.name] ? formData[field.name] : ""}
                                    type="text"
                                    format={formData[field.mask]}
                                    placeholder={field.placeholder}
                                    onChange={handleInputChange}
                                    required={field.required}
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
                        {colaborador !== null ? `Editar colaborador` : `Cadastrar colaborador`}
                    </StyledButton>
                    <StyledButton color="secondary" type="button" disabled={colaborador === null} onClick={handleDelete}>
                        Deletar colaborador
                    </StyledButton>
                </StyledFooter>
            </StyledForm>
        </>
    )
}