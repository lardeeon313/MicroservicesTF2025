import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, TextInput as RNTextInput } from 'react-native';

type Props = {
    description: string;
    onNotifyMissing: (text: string) => void;
    onSubmit: () => void;
    missingItemsState: any[];
    // Nuevas props para manejar los eventos de forma separada
    onToggleCheckbox: (index: number) => void;
    onQuantityChange: (index: number, text: string) => void;
    onQuantityEndEditing: (index: number) => void;
};

const MissingReport = ({
    description,
    onNotifyMissing,
    onSubmit,
    missingItemsState,
    // Recibimos las nuevas props
    onToggleCheckbox,
    onQuantityChange,
    onQuantityEndEditing
}: Props) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 20 }}>

            {/* Logo */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Image
                    source={require('../../../assetsImages/LogoVerona.png')}
                    style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 10 }}
                />
            </View>

            {/* Título */}
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 10 }}>
                Emitir Notificación{'\n'}del Faltante
            </Text>

            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                Informar al encargado del depósito:
            </Text>

            {/* Descripción */}
            <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 6 }}>
                Detalle los faltantes con una breve descripción:
            </Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    textAlignVertical: 'top',
                    marginBottom: 20,
                }}
                multiline
                numberOfLines={5}
                placeholder="Coloque el texto aquí..."
                value={description}
                onChangeText={onNotifyMissing}
            />

            {/* Checklist */}
            <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 6 }}>
                Marque los productos faltantes:
            </Text>
            <FlatList
                data={missingItemsState}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>

                        {/* Checkbox ahora usa onToggleCheckbox */}
                        <TouchableOpacity onPress={() => onToggleCheckbox(index)}>
                            <Text style={{ fontSize: 18 }}>{item.isMissing ? '✅' : '⬜'}</Text>
                        </TouchableOpacity>

                        <Text style={{ marginLeft: 8, flex: 1 }}>
                            {item.productName} ({item.productBrand})
                        </Text>

                        {/* Input cantidad ahora usa las nuevas funciones */}
                        {item.isMissing && (
                            <RNTextInput
                                style={{
                                    marginLeft: 10,
                                    borderWidth: 1,
                                    borderColor: '#d1d5db',
                                    width: 50,
                                    padding: 4,
                                    borderRadius: 4,
                                    textAlign: 'center',
                                }}
                                value={item.missingQuantityInput}
                                onChangeText={(text) => onQuantityChange(index, text)}
                                onEndEditing={() => onQuantityEndEditing(index)}
                                keyboardType="numeric"
                            />
                        )}

                        {/* Mensaje de error (lógica actualizada) */}
                        {item.isMissing && parseInt(item.missingQuantityInput || '0') > item.maxQuantity && (
                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 4 }}>
                                Máx: {item.maxQuantity}
                            </Text>
                        )}
                    </View>
                )}
            />

            {/* Botón enviar */}
            <TouchableOpacity
                style={{
                    backgroundColor: '#f59e0b',
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 20
                }}
                onPress={onSubmit}
            >
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                    Enviar Notificación
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MissingReport;