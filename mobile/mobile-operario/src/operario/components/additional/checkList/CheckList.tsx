import { View, Text,TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useState } from 'react';


type Props = {
    productName:string; 
    quantity:number;
    disblead?: boolean; //EN CASO DE QUE EL PEDIDO ESTE EN PENDIENTE , EL USUARIO NO PUEDE MARCAR 
}

const CheckList = ({ productName, quantity , disblead}: Props) => {
    const [ischecked,setIscheked] = useState(false);

    const toggleCheck = () => {
        if(disblead) return ;
        setIscheked(!ischecked);
    }

    return(
    <TouchableOpacity onPress={toggleCheck} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10,}}>
      <View style={{
         width: 24,
         height: 24,
         borderWidth: 2,
         borderColor: disblead ? '#ccc' : ischecked ? '#10B981' : '#ccc',
         backgroundColor: disblead ? '#e5e7eb' : ischecked ? '#10B981' : '#fff',
         borderRadius: 4,justifyContent: 'center',alignItems: 'center',}}>
        {ischecked &&  !disblead && <Check color="#fff" size={16} />}
      </View>

      <Text style={{ fontSize: 16, marginLeft: 12 }}>
        {productName} - Cantidad: {quantity}
      </Text>
    </TouchableOpacity>
    )
}

export default CheckList;
// This component renders a checklist item with a product name and quantity, along with a check icon.