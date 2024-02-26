import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StyledButton, StyledContainer, StyledFooter } from "./style";

export const ConfirmToast = ({ message, onConfirm }) => {
    const handleConfirm = () => {
        toast.dismiss();
        onConfirm();
    };

    const handleCancel = () => {
        toast.dismiss();
    };

    return (
        <StyledContainer>
            <>{message}</>
            <StyledFooter>
                <StyledButton onClick={handleConfirm}>Sim</StyledButton>
                <StyledButton color={"secondary"} onClick={handleCancel}>Não</StyledButton>
            </StyledFooter>
        </StyledContainer>
    );
};