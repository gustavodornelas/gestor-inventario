import * as React from 'react';
import { StyledTitle } from '../../style/globalStyles';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Header, StyledIcon } from './style';

export default function SearchAppBar( { toggleButtonText }) {

    return (
        <Header>
            <StyledIcon icon={faBars} onClick={toggleButtonText} />
            <StyledTitle>Gestor de Documentação</StyledTitle>
        </Header>
    );
}
