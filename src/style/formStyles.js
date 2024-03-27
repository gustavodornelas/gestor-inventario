import styled, { css } from "styled-components";
import { theme } from "./globalStyles";
import ReactDatePicker from "react-datepicker";
import { PatternFormat } from 'react-number-format';


const inputStyles = css`
    width: 100%;
    color: ${theme.textcolor};
    background-color: ${theme.backgroundcolor};
    font-size: 1rem;
    padding: .5rem;
    border: 1px solid ${theme.bordercolor};
    border-radius: 0.5rem;
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;

    &::placeholder {
        color: transparent;
    }

    &:hover {
        border-color: ${theme.primarycolor};
    }

    &:focus {
    border-color: ${theme.primarycolor};
    };
`;


export const StyledForm = styled.form`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const StyledFormBody = styled.div`
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
`;

export const StyledGroup = styled.div`
    padding: .5rem;
    display: flex;
    flex-direction: column;
`;

export const StyledLabel = styled.label`
    color: ${theme.primarycolor};
    font-size: .9rem;
    font-weight: bold;
    padding: .5rem;
    pointer-events: none;
`;

export const StyledInput = styled.input`
    ${inputStyles}
`;

export const StyledFormatedNumber = styled(PatternFormat)`
  ${inputStyles}
`;

export const StyledDatePicker = styled(ReactDatePicker)`
    ${inputStyles}
`;

export const StyledSelect = styled.select`
    ${inputStyles}

    appearance: none;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E") no-repeat center right ${theme.backgroundColor};
    background-size: contain;
`;


export const StyledOption = styled.option`
    color: ${theme.textcolor};
`;

export const StyledButton = styled.button`
    align-items: center;
    justify-content: center;
    background-color: transparent;
    cursor: ${(props) => {
        if (props.disabled) return 'null';

        return 'pointer';
    }
    };
    color: inherit;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.75;
    text-transform: uppercase;
    min-width: 20rem;
    padding: .5rem;
    border-radius: .5rem;
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    color: #fff;

    &:hover {
        backdrop-filter: brightness(60%);
    }

    &:active {
        backdrop-filter: brightness(70%);
    }

    background-color: ${(props) => {

        if (props.disabled) return theme.buttondisable

        switch (props.color) {
            case "primary":
                return theme.buttonprimarycolor;
            case "secondary":
                return theme.buttonsecondarycolor;
            default:
                return theme.buttonprimarycolor;
        }

    }};
`


export const StyledFooter = styled.footer`
    grid-column: span 3;
    display: flex;
    width: 100%;
    padding-top: 1rem;
    gap: 1rem;
    justify-content: center;
    margin-top: auto; /* Faz o footer sempre ficar no final */
`;
