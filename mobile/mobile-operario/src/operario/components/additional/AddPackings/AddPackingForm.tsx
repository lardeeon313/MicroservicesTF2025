import React,{useState} from "react";
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAddPackagings } from "../../../hocks/useAddPackings";
import type { AddPackingCommand } from "../../../types/AddPackings";

//Componente que utiliza el endpoint de addpackings , le da la chance al operario de agregar
//el empaque que necesite de tal producto: 

type Props = {
    depotOrderItemId: number;
    onSuccess?:() => void;
}

const AddPackingForm: React.FC<Props> = ({depotOrderItemId,onSuccess }) => {
    const [packagingType, setPackingType] = useState('');
    const { addPackagings, loading, error, success } = useAddPackagings();

    const handleSumbit = async() => {
        console.log("Se ejecutó handleSubmit");
        if (!packagingType.trim()) {
            Alert.alert('Error', 'El tipo de empaque no puede estar vacío.');
            return;
        }

        const payload: AddPackingCommand = {
            packagingItems: [ // ✅ nombre correcto en camelCase
                {
                    depotOrderItemId: depotOrderItemId, // ✅ bien
                    packagingType: packagingType.trim() // ✅ bien
                }
            ]
        };

        await addPackagings(payload);

        if (onSuccess && !error) {
            onSuccess();
        }
    };

    return(
        <View style={{marginTop: 10,padding: 10,backgroundColor: '#f2f2f2',borderRadius: 8}}>
            <Text style={{fontWeight: 'bold',marginBottom: 6}}>Agregar tipo de empaque:</Text>
            <TextInput
                style={{borderWidth: 1,borderColor: '#ccc',padding: 8,borderRadius: 4,marginBottom: 10}}
                placeholder="Ej: Caja, Bolsa, Enlatado..."
                value={packagingType}
                onChangeText={setPackingType}
            />

            {loading ? (
                <ActivityIndicator size="small" color="#007bff" />
            ) : (
                <Button title="Agregar empaque" onPress={handleSumbit} />
            )}

            {error && <Text style={{color: 'red',marginTop: 6}}>Error: {error.message}</Text>}
            {success && <Text style={{color: 'green',marginTop: 6}}>✅ Empaque agregado con éxito ✅.</Text>}
        </View>
    );
}

export default AddPackingForm;