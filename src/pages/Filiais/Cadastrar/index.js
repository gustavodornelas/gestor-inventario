import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../../services/api"
import { ConfirmToast } from "../../../components/customToasts"
import Loading from "../../../components/Loading"
import { StyledDatePicker, StyledFooter, StyledForm, StyledGroup, StyledLabel, StyledOption, StyledSelect, StyledButton, StyledInput, StyledFormBody, StyledFormatedNumber, StyledFormatedTelephone } from "../../../style/formStyles"
import { converterData } from "../../../services/formUtils"

export default function CadastrarFilial() {
    const { id } = useParams() // Recupera o id da URL
    const [loading, setLoading] = useState(true)
    const [loadingSelects, setLoadingSelects] = useState(true)
    const [filial, setFilial] = useState(null)
    const [empresa, setEmpresas] = useState([])
    const [formData, setFormData] = useState({})

    const navigate = useNavigate()

    const filiaisFormFields = [
        { name: "razao_social", label: "Razão Social", type: "text", required: true },
        { name: "cnpj", label: "CNPJ", type: "formatedNumber", mask: '##.###.###/####-##', required: true },
        { name: "nome_fantasia", label: "Nome Fantasia", type: "text" },
        { name: 'id_empresa', label: "Empresa", type: "select", options: empresa, labelKey: "nome_fantasia" },
        { name: "inscricao_estadual", label: "Inscrição Estadual", type: "text" },
        { name: "inscricao_municipal", label: "inscricao Municipal", type: "text" },
        { name: "cep", label: "CEP", type: "formatedNumber", mask: '#####-###' },
        { name: "logradouro", label: "Logradouro", type: "text" },
        { name: "numero_endereco", label: "Número", type: "text" },
        { name: "complemento", label: "Complemento", type: "text" },
        { name: "bairro", label: "Bairro", type: "text" },
        { name: "cidade", label: "Cidade", type: "text" },
        { name: "estado", label: "Estado", type: "text" },
        { name: "telefone", label: "Telefone", type: "formatedTelephone" },
        { name: "email", label: "E-mail", type: "email" },
    ];

    // Carregando as empresas e filiais para o Select
    useEffect(() => {
            api.get('empresa')
            .then(response => {
                setEmpresas(response.data);
                setLoadingSelects(false);
            })
            .catch(error => {
                toast.error(error);
            });
    }, []);

    // Carregando as empresas em caso de edição
    useEffect(() => {
        if (id) {
            api.get('filial/' + id)
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

                    setFilial(dados)
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
        if (filial) {
            const newFormData = {}
            filiaisFormFields.forEach((field) => {
                newFormData[field.name] = filial[field.name]
            })
            setFormData(newFormData)
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filial])


    // Funções de controle de Formulário
    function handleInputChange(e) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        console.log(formData)
    }

    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date })
        console.log(formData)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        // Verificar se está em modo de edição ou cadastro
        if (filial !== null) {
            // Modo de edição
            await api.put(`/filial/` + id, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/filiais`)
                })
                .catch(err => toast.error(err.response.data))
        } else {
            // Modo de cadastro
            await api.post(`/filial/`, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/filiais`)
                })
                .catch(err => toast.error(err.response.data))
        }
    }

    const deleteItem = () => {
        api.delete(`/filial/` + id).then((res) => {
            toast.success(res.data)
            navigate(`/filiais`)
        })
            .catch(err => toast.error(err.response.data))
    }

    const handleDelete = () => {
        const msg = `Deseja realmente deletar a Filial ` + filial.nome_fantasia + "?"

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
            <h2> Cadastro de Filiais </h2>
            <StyledForm onSubmit={handleSubmit}>
                <StyledFormBody>
                    {filiaisFormFields.map(field => (
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
                                        filial ? (
                                            filial[field.name] ? false : true
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
                                    placeholder={field.placeholder}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    format={field.mask}

                                />
                            ) : field.type === "formatedTelephone" ? (
                                <StyledFormatedTelephone
                                    name={field.name}
                                    value={formData[field.name]}
                                    type="text"
                                    placeholder={field.placeholder}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    separaNono
                                    temDDD
                                    separaDDD

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
                        {filial !== null ? `Editar filial` : `Cadastrar filial`}
                    </StyledButton>
                    <StyledButton color="secondary" type="button" disabled={filial === null} onClick={handleDelete}>
                        Deletar filial
                    </StyledButton>
                </StyledFooter>
            </StyledForm>
        </>
    )
}