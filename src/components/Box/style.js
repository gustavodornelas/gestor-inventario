import styled from "styled-components";
import { theme } from "../../style/globalStyles";

const StyledBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items:  start;
    flex: 1;
    overflow: auto;


    /* Configurações de altura */
    width: 100%;
    height: 100%;
    transition: max-width 0.3s ease;
    
    /* Configurações de espaçamento */
    padding: 1rem;

    /* Configurações de Borda */
    border: ${ theme.bordercolor };
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;

    /* Configurações de cor */
    color: ${theme.textColor};
    background-color: ${ theme.backgroundcolor };
`

export { StyledBox };