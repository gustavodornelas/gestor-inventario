import { Button, TextField, Typography } from "@mui/material";

import  styled  from "styled-components";
import backgroundImage from "../../assets/ti-corporativa.jpg"; // Substitua com o caminho correto para sua imagem



export const StyledContainer = styled.div`
  
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: url(${backgroundImage});
  background-size: cover; 
  background-position: center;
`;

export const StyledFormContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: auto;
  border-radius: .5rem;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  width: 25%;
`;

export const StyledTitle = styled(Typography)`
  text-align: center;
  margin-bottom: 1rem;
`;

export const StyledInput = styled(TextField)`
  && {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

export const StyledButton = styled(Button)`
  && {
    width: 100%;
    color: #fff;
    border-radius: .5rem;
    cursor: pointer;
  }
`;