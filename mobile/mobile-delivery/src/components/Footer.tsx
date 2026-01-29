import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Distribuidora Verona - Todos los derechos reservados
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    alignItems: "center",
    backgroundColor: "#090d13ff", // oscuro
  },
  footerText: {
    color: "#d1d5db",
    fontSize: 12,
  },
});

export default Footer;
