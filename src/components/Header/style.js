import { theme } from "./../../style/globalStyles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const StyledIcon = styled(FontAwesomeIcon)`
    font-size: 1.5rem;
    text-align: center;
    margin: 1rem;
    cursor: pointer;

    color: ${theme.secondarycolor};
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        filter: brightness(70%); /* Pode ajustar o valor para obter o efeito desejado */
    }

    &:active {
        filter: brightness(90%);
    }
`

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;

    /* Configurações de altura */
    width: '100%';
    transition: max-width 0.3s ease;
    
    /* Configurações de espaçamento */
    padding-left: 1rem;

    /* Configurações de cor */
    color: ${theme.textcolor};
    background-color: ${theme.primarycolor};
`