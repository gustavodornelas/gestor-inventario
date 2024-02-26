import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const LoadingMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`

export default function Loading() {
    return (
        <>
            <LoadingMessage>
                <CircularProgress />
                <p>Carregando...</p>
            </LoadingMessage>
        </>
    )
}