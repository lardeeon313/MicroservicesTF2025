import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import { useNavigation, useRoute } from "@react-navigation/native";

import { createPasswordValidationSchema } from "../validations/forgotPassword";
import { createNewPassword } from "../services/AuthService";

const CreatePasswordForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
    LEER PARAMS
  =============================== */
  useEffect(() => {
    try {
      if (route.params?.userId) {
        setUserId(route.params.userId);
        setLoading(false);
        return;
      }

      Alert.alert("Error", "Datos inválidos");
      navigation.navigate("Login");
    } catch (err) {
      console.log("CreatePassword error:", err);

      Alert.alert("Error", "No se pudo continuar");
      navigation.navigate("Login");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ===============================
     LOADING
     =============================== */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  /* ===============================
     SEGURIDAD
     =============================== */
  if (!userId) {
    return null;
  }

  /* ===============================
     FORM
     =============================== */
  return (
    <Formik
      initialValues={{
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={createPasswordValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await createNewPassword({
            userIdentityId: userId,
            newPassword: values.newPassword,
          });

          Alert.alert("Éxito", "Contraseña creada correctamente");

          navigation.navigate("Login");
        } catch (error: any) {
          console.log(error);

          Alert.alert(
            "Error",
            error?.response?.data?.message ||
              error?.message ||
              "Error al crear contraseña"
          );
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Crear contraseña</Text>

          {/* Password */}
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

          {/* Confirm */}
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

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={() => handleSubmit()}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Guardando..." : "Confirmar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default CreatePasswordForm;

/* ===============================
   STYLES
   =============================== */

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#b91c1c",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginBottom: 5,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});