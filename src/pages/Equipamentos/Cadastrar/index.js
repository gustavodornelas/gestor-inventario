import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../../services/api"
import { ConfirmToast } from "../../../components/customToasts"
import Loading from "../../../components/Loading"
import { StyledDatePicker, StyledFooter, StyledForm, StyledGroup, StyledLabel, StyledOption, StyledSelect, StyledButton, StyledInput, StyledFormBody, StyledFormatedNumber, StyledFormatedTelephone } from "../../../style/formStyles"
import { converterData } from "../../../services/formUtils"

export default function CadastrarEquipamento() {
    const { id } = useParams() // Recupera o id da URL
    const [loading, setLoading] = useState(true)
    const [loadingSelects, setLoadingSelects] = useState(true)
    const [equipamento, setEquipamento] = useState(null)
    const [empresas, setEmpresas] = useState([])
    const [filiais, setFiliais] = useState([])
    const [colaboradores, setColaboradores] = useState([])
    const [filiaisFiltradas, setFiliaisFiltradas] = useState([])
    const [colaboradoresFiltrados, setColaboradoresFiltrados] = useState([])
    const [formData, setFormData] = useState({})

    const navigate = useNavigate()

    const EquipamentoFormFields = [
        { name: "tipo_equipamento", label: "Tipo de Equipamento", type: "text" },
        { name: "nome", label: "Nome", type: "text" },
        { name: "descricao", label: "Descrição", type: "text" },
        { name: "id_empresa", label: "Empresa", type: "select", options: empresas, labelKey: "nome_fantasia" },
        { name: "id_filial", label: "Filial", type: "select", options: filiaisFiltradas, labelKey: "nome_fantasia" },
        { name: "situacao", label: "Situação", type: "text" },
        { name: "data_aquisicao", label: "Data da Aquisição", type: "date" },
        { name: "metodo_aquisicao", label: "Metódo da Aquisição", type: "text" },
        { name: "numero_nota_fiscal", label: "Número da Nota Fiscal", type: "text" },
        { name: "fornecedor", label: "Fornecedor", type: "text" },
        { name: "contrato", label: "Contrato", type: "text" },
        { name: "valor_equipamento", label: "Valor do Equipamento", type: "text" },
        { name: "id_colaborador", label: "Colaborador", type: "select", options: colaboradoresFiltrados, labelKey: "nome" },
        { name: "data_inicial_colaborador", label: "Data inicial do Colaborador", type: "date", minDate: formData.data_aquisicao },
        { name: "data_baixa", label: "Data da Baixa", type: "date", minDate: formData.data_aquisicao },
        { name: "motivo_baixa", label: "Motivo da Baixa", type: "text" },
        { name: "marca", label: "Marca", type: "text" },
        { name: "modelo", label: "Modelo", type: "text" },
        { name: "numero_serie", label: "Número de Série", type: "text" },
        { name: "sistema_operacional", label: "Sistema Operacional", type: "text" },
        { name: "disco_SSD", label: "Disco / SSD", type: "text" },
        { name: "memoria", label: "Memoria", type: "text" },
        { name: "processador", label: "Processador", type: "text" }
    ];

    // Carregando as empresas, filiais e colaboradores para o Select
    useEffect(() => {
        Promise.all([
            api.get('empresa'),
            api.get('filial'),
            api.get('colaborador')
        ])
            .then(([empresasResponse, filiaisResponse, colaboradoresResponse]) => {
                setEmpresas(empresasResponse.data);
                setFiliais(filiaisResponse.data);
                setColaboradores(colaboradoresResponse.data);
                setLoadingSelects(false);
            })
            .catch(error => {
                toast.error(error);
            });
    }, []);

    // Filtrar as filiais quando o formData.id_empresa mudar
    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        const filtro = filiais.filter(filial => filial.id_empresa == formData.id_empresa);
        setFiliaisFiltradas(filtro);

    }, [formData.id_empresa, filiais]);

    // Filtrar os Colaboradores quando o formData.id_filial mudar
    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        const filtro = colaboradores.filter(colaborador => colaborador.id_filial == formData.id_filial);
        setColaboradoresFiltrados(filtro);

    }, [formData.id_filial, colaboradores]);

    // Carregando os Colaboradores em caso de edição
    useEffect(() => {
        if (id) {
            api.get('equipamento/' + id)
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

                    setEquipamento(dados)
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
        if (equipamento) {
            const newFormData = {}
            EquipamentoFormFields.forEach((field) => {
                newFormData[field.name] = equipamento[field.name]
            })
            setFormData(newFormData)
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equipamento])


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

        if (!formData.id_empresa) {
            formData.id_filial = null
        }

        if (!formData.id_filial) {
            formData.id_colaborador = null
        }

        // Verificar se está em modo de edição ou cadastro
        if (equipamento !== null) {
            // Modo de edição
            await api.put(`/equipamento/` + id, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/equipamentos`)
                })
                .catch(err => toast.error(err.response.data))
        } else {
            // Modo de cadastro
            await api.post(`/equipamento/`, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate(`/equipamentos`)
                })
                .catch(err => toast.error(err.response.data))
        }
    }

    const deleteItem = () => {
        api.delete(`/equipamento/` + id).then((res) => {
            toast.success(res.data)
            navigate(`/equipamento`)
        })
            .catch(err => toast.error(err.response.data))
    }

    const handleDelete = () => {
        const msg = `Deseja realmente deletar o equipamento ` + equipamento.nome + "?"

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
            <h2> Cadastro de Equipamentos </h2>
            <StyledForm onSubmit={handleSubmit}>
                <StyledFormBody>
                    {EquipamentoFormFields.map(field => (
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
                                        equipamento ? (
                                            equipamento[field.name] ? false : true
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
                        {equipamento !== null ? `Editar equipamento` : `Cadastrar equipamento`}
                    </StyledButton>
                    <StyledButton color="secondary" type="button" disabled={equipamento === null} onClick={handleDelete}>
                        Deletar colaborador
                    </StyledButton>
                </StyledFooter>
            </StyledForm>
        </>
    )
}