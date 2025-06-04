//pages/OperatorDashboardPage.tsx

import React from "react";
import { View } from "react-native";
import NavbarOperator from "../../components/Navbar/NavbarOperator";
import OperatorDashboardComponent from "../../navigation/OperatorDashboard";

// Simulación de usuario y autenticación
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;

const OperatorDashboardPage = () => {
    return(
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")} />
            <OperatorDashboardComponent/>
        </View>
    )
}

export default OperatorDashboardPage;