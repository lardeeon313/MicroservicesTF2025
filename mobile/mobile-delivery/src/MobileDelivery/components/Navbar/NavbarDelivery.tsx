import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface NavbarDeliveryProps {
  user: {
    name: string;
    role: string;
    team?: { teamName: string };
  } | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const NavbarDelivery = ({ user, isAuthenticated, logout }: NavbarDeliveryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    Animated.timing(fadeAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={{
        backgroundColor: "#1f2937",
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#374151",
      }}
    >
      {/* Logo + título */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => navigation.navigate("Dashboard" as never)}
      >
        <Image
          source={require("../../../assetsImages/LogoVerona.png")}
          style={{
            width: 36,
            height: 36,
            marginRight: 8,
            resizeMode: "contain",
          }}
        />
        <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
          Distribuidora Verona
        </Text>
      </TouchableOpacity>

      {/* Perfil */}
      {isAuthenticated && user && (
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={toggleMenu}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 6,
              paddingHorizontal: 8,
              borderRadius: 8,
              backgroundColor: isOpen ? "#a91c1c" : "transparent",
            }}
          >
            <Image
              source={require("../../../assetsImages/icon-person.png")}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                marginRight: 8,
              }}
            />

            <View style={{ flexShrink: 1 }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {user.name}
              </Text>
              <Text
                style={{
                  color: "#f3f4f6",
                  fontSize: 12,
                  marginBottom: user.team?.teamName ? 4 : 0,
                }}
              >
                {user.role}
              </Text>

              {user.team?.teamName && (
                <View
                  style={{
                    backgroundColor: "#611212ff",
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                    borderRadius: 6,
                    alignSelf: "flex-start", // 👈 evita que estire todo
                  }}
                >
                  <Text
                    style={{
                      color: "#9ca3af",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    Equipo: 
                  </Text>
                  <Text style={{ color: "#d1d5db", fontSize: 11 }}>
                    {user.team.teamName}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Menú */}
          {isOpen && (
            <Animated.View
              style={{
                position: "absolute",
                right: 0,
                top: 50,
                backgroundColor: "#ffffff",
                borderRadius: 8,
                padding: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 5,
                zIndex: 1000,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  logout();
                  setIsOpen(false);
                }}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 6,
                  backgroundColor: "#fee2e2",
                }}
              >
                <Text style={{ color: "#dc2626", fontWeight: "600" }}>
                  Cerrar sesión
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
};

export default NavbarDelivery;
