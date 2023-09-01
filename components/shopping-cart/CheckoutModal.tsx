// CheckoutModal.tsx
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  SectionList,
} from 'react-native';

import { CartItemCard } from './CartItemCard';
import { shallowEqual } from 'react-redux';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  checkOutThunk,
  clearShoppingCartItemsThunk,
  removeShoppingCartItemThunk,
  shoppingCartItemsSelector,
} from '../../redux/slices/ShoppingCartSlice';
import { currentSessionSelector } from '../../redux/slices/AuthSlice';
import { AuthScreen } from '../../screens/auth/AuthScreen';

interface CheckoutModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const CheckoutModal: any = ({
  isVisible,
  onClose,
}: CheckoutModalProps) => {
  console.log('hi from cart modal'); // render check
  const dispatch = useAppDispatch();
  const cartItemsWithDetails = useAppSelector(
    shoppingCartItemsSelector,
    shallowEqual
  );
  console.log('cart items', cartItemsWithDetails); // render check
  const currentSession = useAppSelector(currentSessionSelector, shallowEqual);

  const getCartTotal = () => {
    return (
      cartItemsWithDetails &&
      cartItemsWithDetails.reduce((total, item) => {
        return total + (item.price || 0);
      }, 0)
    );
  };

  const clearCart = async () => {
    dispatch(clearShoppingCartItemsThunk({ userId: currentSession?.user?.id }));
  };

  const handleRemoveCartItem = (itemId: number) => {
    dispatch(
      removeShoppingCartItemThunk({
        userId: currentSession?.user?.id,
        cartItemId: itemId,
      })
    );
  };

  const handleCheckout = async () => {
    dispatch(checkOutThunk({}));
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
      transparent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Checkout Modal</Text>
              {currentSession?.user ? (
                <>
                  <View style={styles.container}>
                    {cartItemsWithDetails &&
                      cartItemsWithDetails.map((item, index) => (
                        <CartItemCard
                          key={index}
                          item={item}
                          onRemoveItem={() => handleRemoveCartItem(item?.id)}
                        />
                      ))}
                  </View>
                  <Text style={styles.totalText}>Total: ${getCartTotal()}</Text>
                  <TouchableOpacity
                    onPress={clearCart}
                    style={[styles.button, styles.clearButton]}
                  >
                    <Text style={styles.buttonText}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleCheckout}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Checkout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={[styles.button, styles.closeButton]}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <AuthScreen showNavigation={false} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  eventItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    height: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 18,
  },
  removeButtonText: {
    fontSize: 16,
    color: 'red',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3d73dd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  closeButton: {
    backgroundColor: '#ccc',
    marginTop: 10,
  },
});
