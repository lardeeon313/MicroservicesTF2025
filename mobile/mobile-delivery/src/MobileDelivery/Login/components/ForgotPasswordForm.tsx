import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, SafeAreaView, Modal } from "react-native";
import { useState } from "react";
import { Formik } from "formik";
import { forgotPasswordValidationSchema } from "../validations/forgotPassword";
import { forgotPassword } from "../services/AuthService";
import { useNavigation } from "@react-navigation/native";

const logoVerona = require('../../../assetsImages/LogoVerona.png');

export const ForgotPasswordForm = () => {
  const navigation = useNavigation<any>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const response = await forgotPassword(values);

      if (response.requiresPasswordCreation) {
        navigation.navigate("CreatePassword", { userId: response.userId });
        return;
      }

      setShowSuccessModal(true);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <Image source={logoVerona} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.title}>Recuperar contraseña</Text>

        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("email")}
                value={values.email}
                placeholder="tu@mail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmit as any}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.successIcon}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.modalTitle}>¡Correo enviado!</Text>
              <Text style={styles.modalMessage}>
                Hemos enviado un enlace de recuperación a tu correo electrónico. 
                Por favor revisa tu bandeja de entrada.
              </Text>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleCloseModal}
              >
                <Text style={styles.modalButtonText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 15,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#c62828',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#c62828',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});