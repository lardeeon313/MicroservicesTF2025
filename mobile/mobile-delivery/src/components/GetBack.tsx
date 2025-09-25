import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GetBack = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.text}>← Volver</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#d3121cff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start", // 👈 queda a la izquierda
    marginBottom: 12,
  },
  text: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default GetBack;