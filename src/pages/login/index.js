import React, { useContext, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledButton, StyledContainer, StyledFormContainer, StyledInput, StyledTitle } from './Style';
import { AuthContext } from '../../context/auth';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const { signIn, signed } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        const data = {
            usuario,
            senha,
        };

        await signIn(data);
    };


    if (signed) {
        return < Navigate to="/Home" />
    } else {
        return (
            <StyledContainer component="main" maxWidth="md">
                <CssBaseline>
                    <StyledFormContainer>
                        <StyledTitle component="h1" variant="h5">
                            Login
                        </StyledTitle>
                        <StyledInput
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="usuario"
                            label="Usuário"
                            name="usuario"
                            autoComplete="usuario"
                            autoFocus
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                        />
                        <StyledInput
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="senha"
                            label="Senha"
                            type="password"
                            id="senha"
                            autoComplete="senha-atual"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <StyledButton variant="contained" onClick={handleLogin}>
                            Login
                        </StyledButton>
                    </StyledFormContainer>
                </CssBaseline>
            </StyledContainer>
        );
    }
};

export default Login;
