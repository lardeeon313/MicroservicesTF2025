import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { DepotStackParamList } from "../types/DepotStackType";

//se importata las paginas para colocarlas dentro de los componentes del stack
import ListofMissingOrdersPage from "../pages/listOrdersPages/ListofMissingOrdersPage";
import NotificationSectionPage from "../pages/NotificationPages/NotificationSectionPage";
import DetailOrderPage from "../pages/detailPages/DetailOrderPage";
import AcceptOrderPage from "../pages/detailPages/AcceptOrderPage";
import MissingPage from "../pages/NotificationPages/MissingReportPage";
import ListofOrdersArmPage from "../pages/listOrdersPages/ListofOrdersArmPage";
import ListOfConfirmedOrdersPage from "../pages/listOrdersPages/ListofConfirmOrdersPage";
import OperatorDashboardPage from "../pages/navigationPages/OperatorDashboardPage";

const Stack = createNativeStackNavigator<DepotStackParamList>();

export default function DepotNavigator() {
    return(
        <Stack.Navigator initialRouteName="OperatorDashboard">
            <Stack.Screen 
                name="OperatorDashboard" 
                component={OperatorDashboardPage} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="ArmOrders" 
                component={ListofOrdersArmPage} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="ConfirmedOrders" 
                component={ListOfConfirmedOrdersPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="MissingOrders" 
                component={ListofMissingOrdersPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AcceptOrder" 
                component={AcceptOrderPage} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetailOrder"
                component={DetailOrderPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="MissingReport"
                component={MissingPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="NotificationPage"
                component={NotificationSectionPage}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}