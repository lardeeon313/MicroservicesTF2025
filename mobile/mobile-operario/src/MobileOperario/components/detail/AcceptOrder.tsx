import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import type { DepotOrderDTO, DepotOrderStatus } from "../../types/OrderDTO";
import { OrderStatusLabels } from "../../constants/UseStatusOrderOperator";
import { PackageCheck, UserRound, Package, Info } from 'lucide-react-native';

type Props = {
  order: DepotOrderDTO;
  onAccept: () => void;
  onReject: () => void;
}

const AcceptOrder = ({ order, onAccept, onReject }: Props) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <PackageCheck size={28} color="#1a73e8" />
        </View>
        <Text style={styles.title}>
          Confirmar Pedido #{order.depotOrderId}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <UserRound size={20} color="#5f6368" />
            <Text style={styles.sectionTitle}>Cliente</Text>
          </View>
          <Text style={styles.customerEmail}>{order.customerEmail}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#5f6368" />
            <Text style={styles.sectionTitle}>Productos</Text>
          </View>
          
          {order.items?.map((producto, index) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productDot} />
              <Text style={styles.productText}>
                {producto.productName}, {producto.productBrand}
              </Text>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>x{producto.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.statusContainer}>
          <Info size={20} color="#1a73e8" />
          <Text style={styles.statusLabel}>Estado:</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {OrderStatusLabels[order.status as DepotOrderStatus]}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onAccept}
          style={[styles.button, styles.acceptButton]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Aceptar Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onReject}
          style={[styles.button, styles.rejectButton]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Rechazar Pedido</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e8f0fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  customerEmail: {
    fontSize: 15,
    color: '#5f6368',
    marginLeft: 28,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8eaed',
    marginVertical: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginLeft: 28,
  },
  productDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5f6368',
    marginRight: 12,
  },
  productText: {
    fontSize: 15,
    color: '#3c4043',
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5f6368',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5f6368',
  },
  statusBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: '#34a853',
  },
  rejectButton: {
    backgroundColor: '#ea4335',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default AcceptOrder;