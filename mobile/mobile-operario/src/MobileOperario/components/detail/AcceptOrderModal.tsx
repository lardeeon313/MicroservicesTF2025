import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';


interface Props {
  visible: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const AcceptOrderModal: React.FC<Props> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.title}>Aceptar Pedido</Text>

          <Text style={styles.message}>
            ¿Estás seguro de aceptar este pedido?
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirm]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default AcceptOrderModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    elevation: 8, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 10,
  },

  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 22,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancel: {
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },

  confirm: {
    backgroundColor: '#16A34A',
    marginLeft: 8,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
});
