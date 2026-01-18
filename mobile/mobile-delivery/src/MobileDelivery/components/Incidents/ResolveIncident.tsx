// components/Incidents/ResolveIncident.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

interface Props {
  order: any;
  resolutionNotes: string;
  onChangeNotes: (text: string) => void;
  selectedStatus: string | null;
  onSelectStatus: (status: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ResolveDeliveryIncidentComponent: React.FC<Props> = ({
  order,
  resolutionNotes,
  onChangeNotes,
  selectedStatus,
  onSelectStatus,
  onSubmit,
  isLoading,
}) => {
  // Mapeo de estados: valor en inglés -> texto en español
  const statusMapping = {
    "Resolved": "Resuelto",
    "Delivered": "Entregado",
    "Pending": "Pendiente"
  };

  // Los valores que se envían al backend (en inglés)
  const statuses = ["Resolved", "Delivered", "Pending"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resolver incidente del pedido #{order.id}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Notas de resolución:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Describa la resolución..."
          placeholderTextColor="#9CA3AF"
          value={resolutionNotes}
          onChangeText={onChangeNotes}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Estado de resolución del pedido:</Text>
        <View style={styles.statusContainer}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.selectedButton,
              ]}
              onPress={() => onSelectStatus(status)} // Se envía el valor en inglés
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.statusText,
                  selectedStatus === status && styles.selectedText,
                ]}
                numberOfLines={2}
              >
                {statusMapping[status as keyof typeof statusMapping]} {/* Se muestra en español */}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={onSubmit}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Resolver incidente</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,  
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 24, 
    color: "#1b263d",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  section: { 
    marginBottom: 24 
  },
  label: { 
    fontSize: 15, 
    fontWeight: "600",
    color: "#374151", 
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    height: 120,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    gap: 10,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedButton: { 
    backgroundColor: "#3B82F6", 
    borderColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: { 
    color: "#6B7280", 
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 18,
  },
  selectedText: { 
    color: "#FFFFFF",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: { 
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  submitText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});