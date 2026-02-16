import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DeliveryStackParamList } from "../../types/DeliveryStackType";

const DeliveryFAQButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DeliveryStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("DeliveryFAQ")}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>?</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 60,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8b0000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  text: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
});

export default DeliveryFAQButton;