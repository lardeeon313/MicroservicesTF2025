//Componente con toda la parte visual del faltante , en caso de producirse faltante: 
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import LogoPersona from "../../../../assets/icon-person.png"

interface Props {
    desciption: string; 
    onDescriptionChange : (value:string) => void;
    onSumbit: () => void; 
}

export const MissingReportComponent: React.FC<Props> = ({desciption,onDescriptionChange,onSumbit,}) => {
    return(
        <View>
            <Image source={LogoPersona} style={{ width: 80, height: 80, marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                Emitir notificacion del faltante:
            </Text>

                  <TextInput
                    placeholder="Descripción del faltante"
                    value={desciption}
                    onChangeText={onDescriptionChange}
                    multiline
                    style={{
                        width: "100%",
                        height: 150,
                        backgroundColor: "#e5e7eb", // gray-200
                        padding: 8,
                        borderRadius: 8,
                        textAlignVertical: "top",
                    }} />
                    <TouchableOpacity
                        onPress={onSumbit}
                        style={{
                            backgroundColor: "#f87171", // red-400
                            paddingVertical: 10,
                            paddingHorizontal: 24,
                            borderRadius: 8,
                            marginTop: 16,
                        }}
                    ></TouchableOpacity>
        </View>
    )
}
