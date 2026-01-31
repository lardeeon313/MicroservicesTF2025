import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { DeliveryRejectionReason } from "../../types/DeliveryOrderTypeDto";
import { TouchableOpacity } from "react-native";
import { ListCollapse } from "lucide-react-native";

type ItemProps = {
  id: number;
  customer: string;
  address: string;
  status: string;
  priority: string;
  payment: string;
  rejections?: DeliveryRejectionReason[];
};

type Props = {
  items: ItemProps[];
  onSeeDetail: (orderId: number) => void;
};

export default function ListRejectOrdersComponent({ items,  onSeeDetail }: Props) {
  const renderItem = ({ item }: { item: ItemProps }) => {
    const isUrgent = item.priority.toLowerCase().includes("urg") || item.priority === "Urgente";

    return (
      <View
        style={[
          styles.card,
          isUrgent && { backgroundColor: "#fff5f5", borderColor: "#e11d48" },
        ]}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.orderId}>Pedido #{item.id}</Text>
          {isUrgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENTE</Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={styles.value}>{item.customer}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.value}>{item.status}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.addressValue}>{item.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tipo de pago:</Text>
            <Text style={styles.value}>{item.payment}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Prioridad:</Text>
            <Text style={[styles.priorityValue, { color: isUrgent ? "#b91c1c" : "#6b7280" }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        {/* Rejections Section */}
        {item.rejections && item.rejections.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.rejectionsSection}>
              <Text style={styles.rejectionsTitle}>Motivos de rechazo:</Text>
              <View style={styles.rejectionsContent}>
                {item.rejections.map((rej) => (
                  <View key={rej.id} style={styles.rejectionItem}>
                    <Text style={styles.rejectionReason}>
                      • {rej.reason}
                    </Text>
                    <Text style={styles.rejectionDate}>
                      {new Date(rej.rejectedAt).toLocaleString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}    
        <View style={styles.divider} />
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.button, styles.detailButton]}
            onPress={() => onSeeDetail(item.id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ListCollapse size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Ver detalle</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay órdenes rechazadas</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    overflow: 'hidden',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  orderId: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#1f2937',
  },
  urgentBadge: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgentText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
    width: 100,
    flexShrink: 0,
  },
  value: {
    fontSize: 20,
    color: '#1f2937',
    flex: 1,
  },
  addressValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
  },
  priorityValue: {
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  rejectionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rejectionsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  rejectionsContent: {
    gap: 8,
  },
  rejectionItem: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#dc2626',
  },
  rejectionReason: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 4,
  },
  rejectionDate: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '500',
  },
  actionsSection: {
  paddingHorizontal: 16,
  paddingBottom: 16,
},

button: {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
},

detailButton: {
  backgroundColor: "#3B82F6",
},

buttonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,
},

});