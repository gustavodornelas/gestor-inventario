import styled from "styled-components";
import { theme } from "../../style/globalStyles";

export const StyledToolbar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 1rem 0 1rem;
    align-items: center;
    background-color: ${(props) => { return (props.backgroundcolor) ? props.backgroundcolor : theme.backgroundcolor }};
    width: 100%;
`;

export const StyledTitle = styled.div`
    flex: 1; /* Ocupa todo o espaço disponível à esquerda */
`;

export const StyledSearchInput = styled.input`
    color: ${theme.textColor};
    background-color: ${theme.backgroundcolor};
    font-size: 1rem;
    padding: .5rem;
    border: 1px solid ${theme.bordercolor};
    border-radius: 0.5rem;
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;

    &:hover {
        border-color: ${theme.primarycolor};
    }

    &:focus {
    border-color: ${theme.primarycolor};
    };
`