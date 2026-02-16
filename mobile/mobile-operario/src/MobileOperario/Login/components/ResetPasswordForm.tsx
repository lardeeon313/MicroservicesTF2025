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
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { resetPassword } from "../services/AuthService";
import { resetPasswordValidationSchema } from "../validations/forgotPassword";

const ResetPasswordForm = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LEER PARAMS DESDE DEEP LINK
     =============================== */
  useEffect(() => {
    const loadParams = async () => {
      try {
        // 1️⃣ Desde deep link (email)
        const url = await Linking.getInitialURL();

        if (url) {
          console.log("DeepLink URL:", url);

          const parsed = Linking.parse(url);

          const deepEmail = parsed.queryParams?.email as string;
          const deepToken = parsed.queryParams?.token as string;

          if (deepEmail && deepToken) {
            setEmail(deepEmail);
            setToken(deepToken);
            setLoading(false);
            return;
          }
        }

        // 2️⃣ Desde navegación interna
        if (route.params?.email && route.params?.token) {
          setEmail(route.params.email);
          setToken(route.params.token);
          setLoading(false);
          return;
        }

        // 3️⃣ Error
        Alert.alert("Error", "Link inválido o vencido");
        navigation.navigate("Login");
      } catch (err) {
        console.log("Link error:", err);
        Alert.alert("Error", "No se pudo procesar el enlace");
        navigation.navigate("Login");
      } finally {
        setLoading(false);
      }
    };

    loadParams();
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
  if (!email || !token) {
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
      validationSchema={resetPasswordValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await resetPassword({
            email,
            token,
            newPassword: values.newPassword,
          });

          Alert.alert("Éxito", "Contraseña actualizada");

          navigation.navigate("Login");
        } catch (error: any) {
          console.log(error);

          Alert.alert(
            "Error",
            error?.response?.data?.message ||
              error?.message ||
              "Error al cambiar contraseña"
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
          <Text style={styles.title}>Nueva contraseña</Text>

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
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;

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
    backgroundColor: "#B91C1C",
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
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