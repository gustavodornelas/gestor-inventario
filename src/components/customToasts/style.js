import styled from "styled-components";
import { theme } from "../../style/globalStyles";

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export const StyledFooter = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: .5rem;

    margin-top: 1rem;

`

export const StyledButton = styled.button`
    align-items: center;
    justify-content: center;
    color: inherit;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.75;
    padding: .1rem;
    border-radius: .5rem;
    transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    color: #fff;

    cursor: pointer;

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
    }}
`