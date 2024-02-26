import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { Navigate, Outlet } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import { Body, Main } from "./Style";
import Header from "../components/Header";
import Loading from "../components/Loading"
import Box from "../components/Box";

export const PrivateRoutes = () => {

    const { signed } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));

            if (signed) {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [signed]);


    const [showButtonText, setShowButtonText] = useState(
        localStorage.getItem('showButtonText') === 'true'
    );

    const toggleButtonText = () => {
        const newShowButtonText = !showButtonText;
        localStorage.setItem('showButtonText', newShowButtonText);
        setShowButtonText(newShowButtonText);
    };

    if (loading) {
        <Loading />
    } else {

        if (signed) {
            return (
                <Body>
                    <Header toggleButtonText={toggleButtonText} />
                    <Main>
                        <MenuLateral showButtonText={showButtonText} toggleButtonText={toggleButtonText} />
                        <Box>
                            <Outlet />
                        </Box>
                    </Main>
                </Body>
            );
        } else {
            return <Navigate to="/" />;
        }
    }
};
