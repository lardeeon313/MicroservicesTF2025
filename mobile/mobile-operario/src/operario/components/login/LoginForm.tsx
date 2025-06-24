import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup'


interface Props {
    onSubmit: (operatorId : string) => void; 
}

const LoginForm : React.FC<Props> = ({onSubmit}) => {
    return(
    <Formik
      initialValues={{ operatorId: '' }}
      validationSchema={Yup.object({
        operatorId: Yup.string().required('El ID del operador es obligatorio'),
      })}
      onSubmit={(values) => onSubmit(values.operatorId)}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View style={{padding: 24,flex: 1,justifyContent: 'center',backgroundColor: '#fff'}}>
          <Text style={{fontSize: 22,marginBottom: 24,textAlign: 'center',fontWeight: '600',}}>Iniciar Sesión</Text>

          <TextInput
            style={{height: 48,borderColor: '#ccc',borderWidth: 1,paddingHorizontal: 12,borderRadius: 8}}
            placeholder="ID del Operador"
            value={values.operatorId}
            onChangeText={handleChange('operatorId')}
          />
          {touched.operatorId && errors.operatorId && (
            <Text style={{color: '#dc2626',fontSize: 13,marginBottom: 4}}>{errors.operatorId}</Text>
          )}

          <TouchableOpacity style={{backgroundColor: '#b91c1c',paddingVertical: 12,borderRadius: 8,alignItems: 'center'}} onPress={handleSubmit as any}>
            <Text style={{color: '#fff',fontWeight: '600',fontSize: 16}}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
    )
}

export default LoginForm;