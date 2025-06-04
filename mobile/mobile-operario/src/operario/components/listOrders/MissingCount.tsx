import { View, Text } from 'react-native';
import type { Missing } from '../../types/Missing';

type MissingCountProps = {
    items: Missing[];
}

const MissingCount : React.FC<MissingCountProps> = ({ items }) => {
    const totalMissing = items.length;

    return(
        <View style={{backgroundColor: '#fdf6ec',padding: 16,borderRadius: 12,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.2,shadowRadius: 4,elevation: 4,marginBottom: 16,}}>
            <Text style={{fontSize: 18,fontWeight: 'bold'}}>
                Numero de faltantes: {totalMissing}
            </Text>
        </View>
    )
}

export default MissingCount;
// This component displays the total count of missing items in a list.