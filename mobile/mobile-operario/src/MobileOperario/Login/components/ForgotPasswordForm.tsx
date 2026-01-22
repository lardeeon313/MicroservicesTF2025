import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Formik } from "formik";
import { forgotPasswordValidationSchema } from "../validations/forgotPassword";
import { forgotPassword } from "../services/AuthService";
import { useNavigation } from "@react-navigation/native";

export const ForgotPasswordForm = () => {
  const navigation = useNavigation<any>();

  const handleSubmit = async (values: any) => {
    try {
      const response = await forgotPassword(values);

      if (response.requiresPasswordCreation) {
        navigation.navigate("CreatePassword", { userId: response.userId });
        return;
      }

      Alert.alert("Correo enviado");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={forgotPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <View>
          <Text>Email</Text>
          <TextInput
            style={{ borderWidth: 1 }}
            onChangeText={handleChange("email")}
            value={values.email}
          />
          {errors.email && <Text>{errors.email}</Text>}

          <TouchableOpacity onPress={handleSubmit as any}>
            <Text>Enviar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};
