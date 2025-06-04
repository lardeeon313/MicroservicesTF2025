import React, { useState } from 'react';
import { Alert } from 'react-native';
import MissingReport from '../../components/Notification/MissingReport';
import type { Notification, Missing } from '../../types/Missing';
import type { DepotStackParamList } from '../../types/DepotStackType';
import { useRoute, type RouteProp } from '@react-navigation/native';

import NavbarOperator from '../../components/Navbar/NavbarOperator';
import { View } from 'react-native';
import { ValidationMissingReport } from '../../validations/ValidationMissingReport';

//EJEMPLO DE USO DEL NAVBAR: 
// Simulamos autenticación y usuario:
const user = { name: 'Juan Pérez', role: 'Operario' };
const isAuthenticated = true;



type MissingRouteProp = RouteProp<DepotStackParamList, 'MissingReport'>;

const MissingPage = () => {
  const { params } = useRoute<MissingRouteProp>();
  const [description, setDescription] = useState('');

  const missing: Missing = params.missing;

  const onNotifyMissing = (text: string) => {
    setDescription(text);
  };

  const onSubmit = () => {
    ValidationMissingReport(description,missing,(notification:Notification) => {
      Alert.alert(
        "Notificación Enviada",
        `Fecha: ${notification.missingDate.toLocaleDateString()}\nDescripción: ${notification.description}`
      )
      setDescription(`${notification.description}`);
    })

  };

  return (
    <View style={{flex:1}}>
      <NavbarOperator  user={user} isAuthenticated={isAuthenticated} logout={() => console.log("Cerrar sesión")}/>
      <MissingReport
        description={description}
        onNotifyMissing={onNotifyMissing}
        onSubmit={onSubmit}
      />
    </View>
  );
};

export default MissingPage;


// Este componente MissingReportPage se encarga de manejar la lógica de negocio relacionada con la notificación de faltantes.