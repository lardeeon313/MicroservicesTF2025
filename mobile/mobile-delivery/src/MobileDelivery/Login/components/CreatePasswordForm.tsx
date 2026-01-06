import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Formik } from "formik";
import { createPasswordValidationSchema } from "../validations/forgotPassword";
import { createNewPassword } from "../services/AuthService";
import { useNavigation, useRoute } from "@react-navigation/native";

export const CreatePasswordForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { userId } = route.params;

  const handleSubmit = async (values: any) => {
    try {
      await createNewPassword({
        userIdentityId: userId,
        newPassword: values.newPassword,
      });
      Alert.alert("Éxito", "Contraseña creada correctamente");
      navigation.navigate("Login");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      validationSchema={createPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <View style={styles.container}>
          <Text>Nueva contraseña</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            onChangeText={handleChange("newPassword")}
            value={values.newPassword}
          />
          {errors.newPassword && <Text>{errors.newPassword}</Text>}

          <Text>Confirmar contraseña</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            onChangeText={handleChange("confirmPassword")}
            value={values.confirmPassword}
          />
          {errors.confirmPassword && <Text>{errors.confirmPassword}</Text>}

          <TouchableOpacity onPress={handleSubmit as any} style={styles.button}>
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 8 },
  button: { backgroundColor: "#b91c1c", padding: 15, marginTop: 20 },
  buttonText: { color: "white", textAlign: "center" },
});
