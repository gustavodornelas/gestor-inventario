import styled, { createGlobalStyle } from 'styled-components';

// Definindo variáveis globais
export const theme = {
  primarycolor: '#0000b6',
  secondarycolor: '#dddddd',
  selectedcolor: '#eff2fc',
  textcolor: '#242424',
  bordercolor: '#9e9e9e',
  backgroundcolor: '#fff',
  buttonprimarycolor: '#0000b6',
  buttonsecondarycolor: '#900000',
  buttondisable: '#5e5e5e'
};

// Criando um GlobalStyle
export const GlobalStyle = createGlobalStyle`

  body, html {
    margin: 0;
    padding: 0;

    min-width: 100vw;
    min-height: 100vh;

    max-width: 100vw;
    max-height: 100vh;

    overflow: auto;

    font-family: 'M PLUS 1', sans-serif;
    font-family: 'Roboto', Arial, Helvetica, sans-serif;

    background-color: ${theme.secondarycolor};
  }

  *{
    box-sizing: border-box;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
  -webkit-text-fill-color: black !important;
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
  transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
`;

export const StyledTitle = styled.h1`
  color: ${theme.secondarycolor};

  font-size: 1.5rem;


  &::selection{
    color: ${theme.secondarycolor};
    background-color: none;
  }
`