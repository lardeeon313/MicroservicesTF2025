import React , { useState, useEffect }from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { ShoppingCart, PackageCheck, AlertTriangle,Check  } from "lucide-react-native";
import { DepotStackParamList } from "../types/DepotStackType";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useMissingOrders } from "../hocks/useMissingOrders";
import { useAuth } from "../Login/context/useAuth";


type CardItem = {
  title: string;
  description: string;
  icon: React.ElementType;
  path: keyof DepotStackParamList;
};

const cards: CardItem[] = [
  {
    title: 'Pedidos confirmados',
    description: 'Consulta los pedidos asignados para confirmar o rechazar dichos pedidos.',
    icon: PackageCheck,
    path: 'ConfirmedOrders',
  },
  {
    title: 'Pedidos con faltantes',
    description: 'Visualiza los pedidos que tienes y emite los faltantes necesarios.',
    icon: AlertTriangle,
    path: 'MissingOrders',
  },
  {
    title: 'Pedidos en Preparación',
    description: 'Aquí encontrarás los pedidos que ya han sido confirmados y que tienen todos sus productos. Selecciónalos para prepararlos.',
    icon: ShoppingCart,
    path: 'ArmOrders',
  },
  {
    title: 'Pedidos armados',
    description: 'Manda los pedidos preparados para facturarlos.',
    icon: Check,
    path:'PreparedOrders'
  },
];

const OperatorDashboardComponent = () => {
  const { userId, name, role, loading: authLoading, token, team } = useAuth();

  const [reloadKey, setReloadKey] = useState(0);
  const navigation = useNavigation<NativeStackNavigationProp<DepotStackParamList>>();

  // Forzar recarga cuando userId o token cambien
  useEffect(() => {
    if (userId && token) {
      setReloadKey(prevKey => prevKey + 1);
    }
  }, [userId, token]);

  if (authLoading) {
    return <Text>Cargando sesión...</Text>;
  }

  if (!userId || !token) {
    return <Text>Error: no se encontró usuario autenticado</Text>;
  }

  // ✅ A esta altura userId y token están garantizados
  const user = { 
    id: userId, 
    token, 
    name: name ?? "",   // si querés usar name/role después
    role: role ?? "", 
    team: team ?? null
  };

  const { missingOrders, loading, error } = useMissingOrders(user.id);
  

  return(
    <View style={{ flex: 1, padding: 16, backgroundColor: '#ffffff' }}>
      <Text style={{fontSize: 24,fontWeight: '800',marginBottom: 32,color: '#8b0000', letterSpacing: 0.5,lineHeight: 32,textAlign: 'center',textShadowColor: 'rgba(0,0,0,0.1)',textShadowOffset: { width: 1, height: 1 },textShadowRadius: 2,}}>
        ¡Bienvenido {user.name}!
      </Text>
      {cards.map((card,index) => (
        <TouchableOpacity key={index} style={{backgroundColor: '#FFFFFF',borderRadius: 12,padding: 20,marginBottom: 16,shadowColor: '#000',shadowOpacity: 0.08,shadowOffset: { width: 0, height: 4 },shadowRadius: 10,elevation: 3}}
        onPress={() => {
          switch(card.path){
            case 'ConfirmedOrders':
              navigation.navigate('ConfirmedOrders');
              break;
            case 'MissingOrders': 
              navigation.navigate('MissingOrders');
            break;
            case 'ArmOrders':
              navigation.navigate('ArmOrders');
            break;
            case 'PreparedOrders':
              navigation.navigate('PreparedOrders')
            break;
          }
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <card.icon size={24} color="#8b0000" style={{ marginRight: 16 }} />
            <View style={{flex: 1}}>
              <Text style={{ fontSize: 18, fontWeight: '600',color:'#111827' }}>{card.title}</Text>
              <Text style={{ fontSize:14,color: '#6B7280',marginTop:4 }}>{card.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default OperatorDashboardComponent;