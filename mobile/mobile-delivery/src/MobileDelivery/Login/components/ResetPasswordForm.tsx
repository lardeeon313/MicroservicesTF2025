import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Formik } from "formik";
import { resetPassword } from "../services/AuthService";
import { resetPasswordValidationSchema } from "../validations/forgotPassword";
import { useRoute, useNavigation } from "@react-navigation/native";

const ResetPasswordForm = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { email, token } = route.params;

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      validationSchema={resetPasswordValidationSchema}
      onSubmit={async (values) => {
        try {
          await resetPassword({
            email,
            token,
            newPassword: values.newPassword,
          });

          Alert.alert("Éxito", "Contraseña actualizada");
          navigation.navigate("Login");
        } catch (error: any) {
          Alert.alert("Error", error.message);
        }
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            secureTextEntry
            onChangeText={handleChange("newPassword")}
            value={values.newPassword}
          />
          {touched.newPassword && errors.newPassword && (
            <Text style={styles.error}>{errors.newPassword}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            secureTextEntry
            onChangeText={handleChange("confirmPassword")}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#B91C1C", padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  error: { color: "red", marginBottom: 5 },
});

export default ResetPasswordForm;
