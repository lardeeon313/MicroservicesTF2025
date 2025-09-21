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

    const [missingItemsState, setMissingItemsState] = useState(
        order.items.map(item => ({
            ...item,
            isMissing: false,
            missingQuantity: item.quantity,
            missingQuantityInput: String(item.quantity),
            // Asegúrate de que maxQuantity exista en tus items, si no, usa quantity.
            maxQuantity: item.quantity 
        }))
    );
    
    // FUNCIÓN 1: Maneja el click en el checkbox
    const handleToggleCheckbox = (index: number) => {
        const updated = [...missingItemsState];
        const currentItem = updated[index];
        currentItem.isMissing = !currentItem.isMissing;

        // Si se desmarca, resetea la cantidad al valor original
        if (!currentItem.isMissing) {
            currentItem.missingQuantity = currentItem.quantity;
            currentItem.missingQuantityInput = String(currentItem.quantity);
        }
        setMissingItemsState(updated);
    };

    // FUNCIÓN 2: Maneja la actualización del texto del input
    const handleQuantityTextChange = (index: number, text: string) => {
        const updated = [...missingItemsState];
        // Solo permite caracteres numéricos para prevenir errores
        updated[index].missingQuantityInput = text.replace(/[^0-9]/g, '');
        setMissingItemsState(updated);
    };

    // FUNCIÓN 3: Valida el número cuando el input pierde el foco
    const handleQuantityEndEditing = (index: number) => {
        const updated = [...missingItemsState];
        const currentItem = updated[index];

        let parsedQty = parseInt(currentItem.missingQuantityInput || '0', 10);

        if (isNaN(parsedQty)) {
            parsedQty = 0;
        }

        // Valida que la cantidad no supere el máximo del pedido
        const validQty = Math.min(parsedQty, currentItem.maxQuantity);

        // Sincroniza tanto el valor numérico como el texto del input
        currentItem.missingQuantity = validQty;
        currentItem.missingQuantityInput = String(validQty);

        setMissingItemsState(updated);
    };


    const onSubmit = () => {
        const selectedItems = missingItemsState
            .filter(item => item.isMissing && item.missingQuantity > 0) // Añadido chequeo para no enviar faltantes con cantidad 0
            .map(item => ({
                orderItemId: item.id,
                productName: item.productName,
                productBrand: item.productBrand,
                packaging: item.packagingType ?? 'Existen faltantes dentro del pedido',
                quantity: item.missingQuantity,
            }));

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
                maxQuantity: item.quantity
            })));
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <NavbarOperator
                user={user}
                isAuthenticated={isAuthenticated}
                logout={logout}
            />
            <MissingReport
                description={description}
                onNotifyMissing={setDescription}
                onSubmit={onSubmit}
                missingItemsState={missingItemsState}
                // Pasamos las nuevas funciones al componente hijo
                onToggleCheckbox={handleToggleCheckbox}
                onQuantityChange={handleQuantityTextChange}
                onQuantityEndEditing={handleQuantityEndEditing}
            />
        </View>
    );
};

export default MissingPage;