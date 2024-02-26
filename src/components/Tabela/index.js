import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '.././Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { StyledSearchInput, StyledTitle, StyledToolbar } from './style';
import { theme } from '../../style/globalStyles';
import moment from 'moment';
import Loading from '../Loading';


function comparadorDescendente(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparador(ordem, ordenacao) {
  return ordem === 'desc'
    ? (a, b) => comparadorDescendente(a, b, ordenacao)
    : (a, b) => -comparadorDescendente(a, b, ordenacao);
}

function classificacaoEstavel(array, comparador) {
  const estabilizado = array.map((el, index) => [el, index]);
  estabilizado.sort((a, b) => {
    const ordem = comparador(a[0], b[0]);
    if (ordem !== 0) {
      return ordem;
    }
    return a[1] - b[1];
  });
  return estabilizado.map((el) => el[0]);
}

function gerarChavesPeloObjeto(dados) {

  if (dados.length > 0) {
    const chaves = Object.keys(dados[0]).map(key => ({
      id: key,
      numeric: typeof dados[key] === 'number',
      disablePadding: false,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    }));

    return chaves;
  }

  return null;
}



function BarraSuperior(props) {
  const { numSelected: numSelecionados, titulo, onEdit, onAdd, onDelete, filtro, setFiltro } = props;

  // Obtém o valor armazenado em localStorage ou usa false como valor padrão
  const savedSearchVisible = JSON.parse(localStorage.getItem('searchVisible')) || false;

  const [searchVisible, setSearchVisible] = useState(savedSearchVisible);

  useEffect(() => {
    // Salva o valor em localStorage sempre que o estado searchVisible mudar
    localStorage.setItem('searchVisible', JSON.stringify(searchVisible));
  }, [searchVisible]);

  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setFiltro('');
  };

  return (

    <StyledToolbar backgroundColor={(numSelecionados > 0) ? theme.selectedColor : theme.backgroundColor}>
      <StyledTitle>
        {numSelecionados > 0 ? (
          <h2>
            {numSelecionados} selecionados
          </h2>
        ) : (
          <h2>
            {titulo}
          </h2>
        )}
      </StyledTitle>

      <>
        {numSelecionados === 1 ? (
          <div>
            <Tooltip title="Editar">
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : null}

        {numSelecionados === 0 ? (
          <Tooltip title="Cadastrar">
            <IconButton onClick={onAdd}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Excluir">
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Filtrar lista">
          <IconButton onClick={handleSearchToggle}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <StyledSearchInput type='text' label='pesquisar' placeholder='Pesquisar' value={filtro} onChange={(e) => { setFiltro(e.target.value) }} hidden={searchVisible ? false : true} />
      </>
    </StyledToolbar >
  );
}

BarraSuperior.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function CabecalhoTabela(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, chaves } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'selecionar todos os itens',
            }}
          />
        </TableCell>
        {chaves.map((headCell) => (
          headCell.id !== 'id' ?
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell> : null
        ))}
      </TableRow>
    </TableHead>
  );
}

CabecalhoTabela.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function Tabela({ dados, titulo, onEdit, onAdd, onDelete }) {
  const [dadosTabela, setDadosTabela] = useState([
    {
      id: 0,
      'Nenhum dado disponível': 'A tabela está vazia',
    },
  ]);

  const [ordem, setOrdem] = useState('asc');
  const [ordenacao, setOrdenacao] = useState('calories');
  const [selecionado, setSelecionado] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [densidade, setDensidade] = useState(false);
  const [linhasPorPagina, setLinhasPorPagina] = useState(10);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  const limparFiltros = () => {
    setSelecionado([]);
    setOrdem('asc');
    setOrdenacao('calories');
    setPagina(0);
    setFiltro('');
  };

  useEffect(() => {
    if (dados.length > 0) {
      const dadosAtualizados = [];

      Promise.all(
        dados.map(async (element) => {
          const todasAsChaves = Object.keys(element);
          const chavesComData = todasAsChaves.filter((chave) =>
            chave.includes('data')
          );

          await Promise.all(
            chavesComData.map(async (chaveComData) => {
              if (element[chaveComData]) {
                element[chaveComData] = await moment(element[chaveComData]).format(
                  'DD/MM/YYYY'
                );
              }
            })
          );

          dadosAtualizados.push(element);
        })
      ).then(() => {
        setLoading(false);
        setDadosTabela(dadosAtualizados);
      });
    } else {
      setDadosTabela([
        {
          id: 0,
          'Nenhum dado disponível': 'A tabela está vazia',
        },
      ])
    }
    setLoading(false);
    limparFiltros();
  }, [dados]);
  const chaves = gerarChavesPeloObjeto(dadosTabela);

  const handleEdit = () => {
    onEdit(selecionado);
  };

  const handleDelete = () => {
    onDelete(selecionado);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = ordenacao === property && ordem === 'asc';
    setOrdem(isAsc ? 'desc' : 'asc');
    setOrdenacao(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = dadosTabela.map((n) => n.id);
      setSelecionado(newSelected);
      return;
    }
    setSelecionado([]);
  };

  const handleClick = (event, id) => {
    if (dadosTabela.length > 0 && dadosTabela[0].id === 0) {
      return;
    }

    const selectedIndex = selecionado.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selecionado, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selecionado.slice(1));
    } else if (selectedIndex === selecionado.length - 1) {
      newSelected = newSelected.concat(selecionado.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selecionado.slice(0, selectedIndex),
        selecionado.slice(selectedIndex + 1)
      );
    }
    setSelecionado(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPagina(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLinhasPorPagina(parseInt(event.target.value, 10));
    setPagina(0);
  };

  const handleChangeDense = (event) => {
    setDensidade(event.target.checked);
  };

  const isSelected = (id) => selecionado.indexOf(id) !== -1;

  const linhasVazias =
    pagina > 0 ? Math.max(0, (1 + pagina) * linhasPorPagina - dadosTabela.length) : 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filtrarDados = () => {
    if (filtro.trim() === '') {
      return dadosTabela;
    } else {
      return dadosTabela.filter((item) => {
        const valores = Object.values(item);
        return valores.some((valor) =>
          valor.toString().toLowerCase().includes(filtro.toLowerCase())
        );
      });
    }
  };

  const linhasVisiveis = useMemo(
    () =>
      classificacaoEstavel(
        filtrarDados(),
        getComparador(ordem, ordenacao)
      ).slice(pagina * linhasPorPagina, pagina * linhasPorPagina + linhasPorPagina),
    [filtrarDados, ordem, ordenacao, pagina, linhasPorPagina]
  );

  if (loading) {
    return <Loading />
  } else {
    return (
      <>
        <BarraSuperior
          numSelected={selecionado.length}
          titulo={titulo}
          onAdd={onAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filtro={filtro}
          setFiltro={setFiltro}
        />
        <Box>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={densidade ? 'small' : 'medium'}
            >
              <CabecalhoTabela
                numSelected={selecionado.length}
                order={ordem}
                orderBy={ordenacao}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dadosTabela.length}
                chaves={chaves}
              />
              <TableBody>
                {linhasVisiveis.map((linha, index) => {
                  const isItemSelected = isSelected(linha.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, linha.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={linha.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      {chaves.map((chave) => (
                        chave.id !== 'id' ?
                          <TableCell key={chave.id} align="left">
                            {linha[chave.id]}
                          </TableCell>
                          : null
                      ))}
                    </TableRow>
                  );
                })}
                {linhasVazias > 0 && (
                  <TableRow
                    style={{
                      height: (densidade ? 33 : 53) * linhasVazias,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dadosTabela.length}
          rowsPerPage={linhasPorPagina}
          page={pagina}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <FormControlLabel
          control={<Switch checked={densidade} onChange={handleChangeDense} />}
          label="Espaçamento denso"
        />
      </>
    );
  }
}