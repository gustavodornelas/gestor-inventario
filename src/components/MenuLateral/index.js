import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ComputerIcon from '@mui/icons-material/Computer';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { AccountCircle } from '@mui/icons-material';
import styled from 'styled-components';
import { AuthContext } from '../../context/auth';
import { useContext } from 'react';
import { Menu } from './style';

const Footer = styled.div`
  height: 100%;
  display: flex;
  align-items: end;
  flex: 1;
`;

export default function MenuLateral({ showButtonText }) {
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const { signOut } = useContext(AuthContext);

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, to: '/' },
        { text: 'Colaboradores', icon: <PersonIcon />, to: '/colaboradores' },
        { text: 'Empresas', icon: <CorporateFareIcon />, to: '/empresas' },
        { text: 'Equipamentos', icon: <ComputerIcon />, to: '/equipamentos' },
        { text: 'Filiais', icon: <BusinessIcon />, to: '/filiais' },
    ];

    React.useEffect(() => {
        const foundIndex = menuItems.findIndex((item) => item.to === location.pathname);

        if (foundIndex !== -1) {
            setSelectedIndex(foundIndex);
        }
    }, [location]);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <Menu $maxwidth={showButtonText ? '200px' : '60px'}>
            <List component="nav" aria-label="main">
                {menuItems.map((item, index) => (
                    <ListItemButton
                        key={index}
                        selected={selectedIndex === index}
                        onClick={(event) => handleListItemClick(event, index)}
                        component={Link}
                        to={item.to}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText hidden={showButtonText ? false : true} primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
            <Divider />

            <Footer>
                <List component="nav" aria-label="footer">
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText hidden={showButtonText ? false : true} primary={'Logout'} />
                    </ListItemButton>
                </List>
            </Footer>
        </Menu>
    );
}
