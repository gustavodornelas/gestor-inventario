import styled from "styled-components";
import { theme } from "../../style/globalStyles";

export const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items:  start;
    flex: 1;
    overflow: auto;


    /* Configurações de altura */
    max-width: ${(props) => props.$maxwidth ? props.$maxwidth : "200px" };
    height: 100%;
    transition: max-width 0.3s ease;

    /* Configurações de espaçamento */
    margin-right: 1rem;
    overflow: hidden;

    /* Configurações de Borda */
    border: ${ theme.bordercolor};
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;

    /* Configurações de cor */
    color: ${theme.textcolor};
    background-color: ${theme.backgroundcolor };
    
`