import React, { useState, useEffect, useContext } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import { StatusBar } from 'react-native';
import { CheckoutModal } from './CheckoutModal';
// import { useAppSelector, shoppingCartItemsSelector } from '@pongportal/redux';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import { shoppingCartItemsSelector } from '../../redux/slices/ShoppingCartSlice';

export const ShoppingCartFAB = () => {
  // console.log('hi from cart fab');
  const items = useAppSelector(shoppingCartItemsSelector);
  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  // console.log('items: ', items);
  const openCheckoutModal = () => {
    setCheckoutModalVisible(true);
  };

  const closeCheckoutModal = () => {
    setCheckoutModalVisible(false);
  };

  return items && items.length > 0 ? (
    <>
      <TouchableOpacity style={styles.fab} onPress={openCheckoutModal}>
        <FontAwesome5 name="shopping-cart" size={24} color="white" />

        <View style={styles.cartCount}>
          <Text style={styles.cartCountText}>{Object.keys(items).length}</Text>
        </View>

        <CheckoutModal
          isVisible={isCheckoutModalVisible}
          onClose={closeCheckoutModal}
        />
      </TouchableOpacity>
    </>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20,
    right: 20,
    backgroundColor: 'gray',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cartCount: {
    position: 'absolute',
    top: 0,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
