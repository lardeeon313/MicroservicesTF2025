import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import MissingReport from '../../components/Notification/MissingReport';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { DepotStackParamList } from '../../types/DepotStackType';
import type { ReportOrderMissingRequest } from '../../types/Missing';
import type { DepotOrderDTO } from '../../types/OrderDTO';
import { ValidationMissingReport } from '../../validations/ValidationMissingReport';
import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { useAuth } from '../../Login/context/useAuth';

type MissingRouteProp = RouteProp<DepotStackParamList, 'MissingReport'>;

const MissingPage = () => {
    const { params } = useRoute<MissingRouteProp>();
    const order: DepotOrderDTO = params.order;

    const { userId, name, role, isAuthenticated, logout, team } = useAuth();
    const user = userId && name && role ? { id: userId, name, role, team } : null;

    if (!userId) {
        throw new Error("El usuario no está autenticado");
    }

    const [description, setDescription] = useState('');

    // --- 1. AÑADIMOS EL ESTADO PARA MANEJAR LA FALLA DE MARCA ---
    const [missingItemsState, setMissingItemsState] = useState(
        order.items.map(item => ({
            ...item,
            isMissing: false,
            missingQuantity: item.quantity,
            missingQuantityInput: String(item.quantity),
            maxQuantity: item.quantity,
            hasBrandIssue: false, // Para saber si el botón de "Falla Marca" está activo
            brandIssueDescription: '', // Para guardar el texto del input de la marca
        }))
    );
    
    const handleToggleCheckbox = (index: number) => {
        const updated = [...missingItemsState];
        const currentItem = updated[index];
        currentItem.isMissing = !currentItem.isMissing;

        if (!currentItem.isMissing) {
            currentItem.missingQuantity = currentItem.quantity;
            currentItem.missingQuantityInput = String(currentItem.quantity);
            // También reseteamos el estado de la marca al desmarcar
            currentItem.hasBrandIssue = false;
            currentItem.brandIssueDescription = '';
        }
        setMissingItemsState(updated);
    };

    const handleQuantityTextChange = (index: number, text: string) => {
        const updated = [...missingItemsState];
        updated[index].missingQuantityInput = text.replace(/[^0-9]/g, '');
        setMissingItemsState(updated);
    };

    const handleQuantityEndEditing = (index: number) => {
        const updated = [...missingItemsState];
        const currentItem = updated[index];
        let parsedQty = parseInt(currentItem.missingQuantityInput || '0', 10);
        if (isNaN(parsedQty)) parsedQty = 0;
        const validQty = Math.min(parsedQty, currentItem.maxQuantity);
        currentItem.missingQuantity = validQty;
        currentItem.missingQuantityInput = String(validQty);
        setMissingItemsState(updated);
    };
    
    // --- 2. AÑADIMOS LAS FUNCIONES PARA MANEJAR LA FALLA DE MARCA ---
    const handleToggleBrandIssue = (index: number) => {
        const updated = [...missingItemsState];
        updated[index].hasBrandIssue = !updated[index].hasBrandIssue;
        if (!updated[index].hasBrandIssue) {
            updated[index].brandIssueDescription = ''; // Limpiar descripción si se desactiva
        }
        setMissingItemsState(updated);
    };

    const handleBrandIssueChange = (index: number, text: string) => {
        const updated = [...missingItemsState];
        updated[index].brandIssueDescription = text;
        setMissingItemsState(updated);
    };

    const onSubmit = () => {
        const selectedItems = missingItemsState
            .filter(item => item.isMissing && item.missingQuantity > 0)
            .map(item => {
                // --- 3. ACTUALIZAMOS LA LÓGICA DE ENVÍO ---
                let finalBrand = item.productBrand;

                // Si se reportó una falla de marca y se escribió un detalle,
                // ese detalle SOBREESCRIBE la marca original.
                if (item.hasBrandIssue && item.brandIssueDescription.trim()) {
                    finalBrand = item.brandIssueDescription.trim();
                }

                return {
                    orderItemId: item.id,
                    productName: item.productName,
                    productBrand: finalBrand, // El campo correcto ahora recibe la descripción
                    packaging: item.packagingType ?? 'No aplica',
                    quantity: item.missingQuantity,
                };
            });

        if (!description.trim() && selectedItems.length === 0) {
            Alert.alert('Error', 'Debe ingresar una descripción o seleccionar al menos un producto con cantidad mayor a cero.');
            return;
        }

        const missingRequest: ReportOrderMissingRequest = {
            depotOrderId: order.depotOrderId,
            operatorUserId: userId,
            salesOrderId: order.salesOrderId,
            missingReason: 'Faltante detectado',
            missingDescription: description.trim(),
            missingItems: selectedItems,
        };

        console.log("missingRequest a enviar:", JSON.stringify(missingRequest, null, 2));

        ValidationMissingReport(description, missingRequest, () => {
            Alert.alert('Notificación Enviada', `Descripción: ${description || 'Sin descripción'}`);
            setDescription('');
            setMissingItemsState(order.items.map(item => ({
                ...item,
                isMissing: false,
                missingQuantity: item.quantity,
                missingQuantityInput: String(item.quantity),
                maxQuantity: item.quantity,
                hasBrandIssue: false,
                brandIssueDescription: '',
            })));
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <NavbarOperator user={user} isAuthenticated={isAuthenticated} logout={logout} />
            <MissingReport
                description={description}
                onNotifyMissing={setDescription}
                onSubmit={onSubmit}
                missingItemsState={missingItemsState}
                onToggleCheckbox={handleToggleCheckbox}
                onQuantityChange={handleQuantityTextChange}
                onQuantityEndEditing={handleQuantityEndEditing}
                // --- 4. PASAMOS LAS NUEVAS FUNCIONES AL COMPONENTE ---
                onToggleBrandIssue={handleToggleBrandIssue}
                onBrandIssueChange={handleBrandIssueChange}
            />
        </View>
    );
};

export default MissingPage;