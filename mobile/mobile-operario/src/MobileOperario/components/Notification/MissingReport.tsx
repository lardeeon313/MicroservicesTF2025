import React from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, FlatList, TextInput as RNTextInput } from 'react-native';

type Props = {
    description: string;
    onNotifyMissing: (text: string) => void;
    onSubmit: () => void;
    missingItemsState: any[];
    onToggleCheckbox: (index: number) => void;
    onQuantityChange: (index: number, text: string) => void;
    onQuantityEndEditing: (index: number) => void;
    // --- 1. AÑADIMOS LAS PROPS PARA LA MARCA ---
    onToggleBrandIssue: (index: number) => void;
    onBrandIssueChange: (index: number, text: string) => void;
};

const MissingReport = ({
    description,
    onNotifyMissing,
    onSubmit,
    missingItemsState,
    onToggleCheckbox,
    onQuantityChange,
    onQuantityEndEditing,
    // --- 2. LAS RECIBIMOS ---
    onToggleBrandIssue,
    onBrandIssueChange
}: Props) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 20 }}>

            {/* Logo, Título y Descripción (sin cambios) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Image
                    source={require('../../../assetsImages/LogoVerona.png')}
                    style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 10 }}
                />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 10 }}>
                Emitir Notificación{'\n'}del Faltante
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
                Informar al encargado del depósito:
            </Text>
            <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 6 }}>
                Detalle los faltantes con una breve descripción:
            </Text>
            <TextInput
                style={{
                    borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#ffffff',
                    borderRadius: 8, padding: 12, fontSize: 14,
                    textAlignVertical: 'top', marginBottom: 20,
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
                    <View style={{ marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => onToggleCheckbox(index)}>
                                <Text style={{ fontSize: 18 }}>{item.isMissing ? '✅' : '⬜'}</Text>
                            </TouchableOpacity>
                            <Text style={{ marginLeft: 8, flex: 1 }}>
                                {item.productName} ({item.productBrand})
                            </Text>
                            {item.isMissing && (
                                <RNTextInput
                                    style={{ marginLeft: 10, borderWidth: 1, borderColor: '#d1d5db', width: 50, padding: 4, borderRadius: 4, textAlign: 'center' }}
                                    value={item.missingQuantityInput}
                                    onChangeText={(text) => onQuantityChange(index, text)}
                                    onEndEditing={() => onQuantityEndEditing(index)}
                                    keyboardType="numeric"
                                />
                            )}
                        </View>
                        
                        {/* --- 3. AÑADIMOS LA UI PARA LA FALLA DE MARCA --- */}
                        {item.isMissing && (
                            <View style={{ marginLeft: 35, marginTop: 6 }}>
                                <TouchableOpacity
                                    onPress={() => onToggleBrandIssue(index)}
                                    style={{
                                        paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6,
                                        backgroundColor: item.hasBrandIssue ? '#fef2f2' : '#f3f4f6', 
                                        borderColor: item.hasBrandIssue ? '#ef4444' : '#d1d5db',
                                        borderWidth: 1, alignSelf: 'flex-start'
                                    }}
                                >
                                    <Text style={{ color: item.hasBrandIssue ? '#b91c1c' : '#374151', fontSize: 12, fontWeight: '500' }}>
                                        {item.hasBrandIssue ? '✔ Falla Marca' : 'Falla Marca'}
                                    </Text>
                                </TouchableOpacity>
                                
                                {item.hasBrandIssue && (
                                    <TextInput
                                        style={{ height: 40, marginTop: 6, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, paddingHorizontal: 10, backgroundColor: 'white', fontSize: 12 }}
                                        placeholder="Describa el problema (Ej: llegó marca Aliada)"
                                        value={item.brandIssueDescription}
                                        onChangeText={(text) => onBrandIssueChange(index, text)}
                                    />
                                )}
                            </View>
                        )}

                        {item.isMissing && parseInt(item.missingQuantityInput || '0') > item.maxQuantity && (
                            <Text style={{ color: 'red', fontSize: 12, marginLeft: 35, marginTop: 4 }}>
                                Máximo pedido: {item.maxQuantity}
                            </Text>
                        )}
                    </View>
                )}
            />

            {/* Botón enviar (sin cambios) */}
            <TouchableOpacity
                style={{ backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 }}
                onPress={onSubmit}>
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>
                    Enviar Notificación
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MissingReport;