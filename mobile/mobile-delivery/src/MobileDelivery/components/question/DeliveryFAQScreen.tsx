import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "Una vez que confirme el pedido , aparecerá en el mapa? ",
    answer:
      "No. Al confirmar el pedido, este se muestra en el listado de pedidos confirmados.Cuando el recorrido comience y lo marques como “En camino”, recién ahí aparecerá en el mapa",
  },
  {
    question: "Se puede ver de manera rápida todos los pedidos en camino? ",
    answer:
      "Si! Con el botón de “Ver mapa de pedidos” podrás ver todos los pedidos en camino",
  },
  {
    question: "Se puede ver de manera rápida todos los pedidos con incidentes? ",
    answer: "Si! Con el botón de “Ver mapa de pedidos” podrás ver todos los pedidos con incidentes"
  },
  {
    question: "¿Cómo hago para cerrar sesión?",
    answer:
      "Para cerrar sesión presiona el ícono donde aparece el nombre de tu usuario y luego el botón de “Cerrar sesión”.",
  },
];

const DeliveryFAQScreen = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  const openAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(10);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAnimation = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 10,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const handlePress = (index: number) => {
    if (openIndex === index) {
      closeAnimation(() => setOpenIndex(null));
    } else {
      setOpenIndex(index);
      openAnimation();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Centro de ayuda</Text>

      {faqData.map((item, index) => (
        <View key={index} style={{ marginBottom: 24 }}>
          {/* 🟣 Pregunta */}
          <TouchableOpacity
            style={styles.userBubble}
            activeOpacity={0.85}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.userText}>{item.question}</Text>
          </TouchableOpacity>

          {/* 🟤 Respuesta animada */}
          {openIndex === index && (
            <Animated.View
              style={[
                styles.systemBubble,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.systemText}>{item.answer}</Text>
            </Animated.View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#8b0000",
    textAlign: "center",
    marginBottom: 32,
  },

  /* 🟣 Pregunta (usuario) */
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#8b0000",
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },

  /* 🟤 Respuesta (sistema) */
  systemBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  systemText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DeliveryFAQScreen;