import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';

type Props = {
    productName:string; 
    quantity:number;
}

const CheckList = ({ productName, quantity }: Props) => {
    return(
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Check color="#00FF00" size={20} />
                <Text style={{ fontSize: 16, marginLeft: 8 }}>
                    {productName} - Cantidad: {quantity}
                </Text>
        </View>
    )
}

export default CheckList;
// This component renders a checklist item with a product name and quantity, along with a check icon.