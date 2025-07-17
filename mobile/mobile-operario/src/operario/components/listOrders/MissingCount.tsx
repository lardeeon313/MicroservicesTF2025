import { View, Text,ActivityIndicator } from 'react-native';
import type { DepotOrderMissingDTO } from '../../types/Missing';
import { useGetNotificationMissing } from '../../hocks/useGetNotificationsMissing';


type MissingCountProps = {
  missings: DepotOrderMissingDTO[];
};

type Props = {
  depotOrderId: number;
  operatorUserId: string;
};

const MissingCount: React.FC<MissingCountProps> = ({ missings }) => {
  const totalReportes = missings.length;
  return (
    <View style={{backgroundColor: '#fdf6ec',padding: 16,borderRadius: 12,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.2,shadowRadius: 4,elevation: 4,marginBottom: 16,}}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Total de reportes de faltantes: {totalReportes}
      </Text>
    </View>
  );
};

export default MissingCount;




export const MissingCountContainer: React.FC<Props> = ({ depotOrderId, operatorUserId }) => {
  const { order, loading, error } = useGetNotificationMissing(depotOrderId, operatorUserId);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={{ color: "red" }}>Error al cargar notificaciones</Text>;
  if (!order?.missings) return <Text>No hay reportes de faltantes.</Text>;

  return <MissingCount missings={order.missings} />;
};



// This component displays the total count of missing items in a list.