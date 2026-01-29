// components/NavbarDelivery.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveryStackParamList } from "../../types/DeliveryStackType";
import { getTeamByDeliveryOperator } from "../../services/getTeamNameForDelivery";

type DeliveryNav = NativeStackNavigationProp<DeliveryStackParamList>;

interface NavbarProps {
  user: {
    id?: string; // Asegúrate de tener este campo
    name: string;
    role: string;
    team?: string | null | undefined;
  } | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const NavbarDelivery = ({ user, isAuthenticated, logout }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(user?.team ?? null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<DeliveryNav>();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    Animated.timing(fadeAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // 🧠 Obtener equipo del operador al montar el componente
  useEffect(() => {
  const fetchTeam = async () => {
    if (user?.id) {
      const fetchedTeam = await getTeamByDeliveryOperator(user.id);
      setTeamName(fetchedTeam.teamName); // 👈 solo el string
    }
  };
  fetchTeam();
}, [user?.id]);


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
      {/* Logo y título */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Image
          source={require("../../../assetsImages/LogoVerona.png")}
          style={{
            width: 40,
            height: 40,
            marginRight: 8,
            resizeMode: "contain",
          }}
        />
        <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
          Distribuidora Verona
        </Text>
      </TouchableOpacity>

      {/* Perfil con logout */}
      {isAuthenticated && user && (
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            onPress={toggleMenu}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              padding: 8,
              borderRadius: 8,
              backgroundColor: isOpen ? "#374151" : "transparent",
            }}
          >
            <Image
              source={require("../../../assetsImages/icon-person.png")}
              style={{
                width: 36,
                height: 36,
                resizeMode: "contain",
                borderRadius: 18,
              }}
            />
            <View>
              <Text
                style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}
              >
                {user.name}
              </Text>
              <Text style={{ color: "#9ca3af", fontSize: 12 }}>
                {user.role}
              </Text>
              <View
                style={{
                  backgroundColor: "#c8c8cfff",
                  padding: 4,
                  borderRadius: 8,
                  marginTop: 2,
                  width: "auto",
                }}
              >
                <Text
                  style={{
                    color: "#161718ff",
                    fontSize: 9,
                    fontWeight: "600",
                  }}
                >
                  Equipo:
                </Text>
                <Text
                  style={{
                    color: "#9e0f0fff",
                    fontSize: 9,
                    fontWeight: "800",
                  }}
                >
                  {teamName ?? "N/A"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Logout */}
          {isOpen && (
            <Animated.View
              style={{
                position: "absolute",
                right: 0,
                top: 50,
                backgroundColor: "#ffffff",
                borderRadius: 8,
                padding: 8,
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
                onPress={async () => {
                  await logout();
                  setIsOpen(false);
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  marginVertical: 4,
                  backgroundColor: "#fef2f2",
                }}
              >
                <Text style={{ color: "#ef4444", fontWeight: "600" }}>
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
