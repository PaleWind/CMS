import React from 'react';
import { Text } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import {
  // CartItemWithDetails,
  CartItem,
  CartItemDetails,
} from '../../types/types';

// import { useAppDispatch, removeShoppingCartItemThunk } from '@pongportal/redux';

interface RenderProductDetailsProps {
  item: CartItemDetails;
  onRemoveItem: any;
}

export const CartItemCard: React.FC<RenderProductDetailsProps> = ({
  item,
  onRemoveItem,
}) => {
  return (
    <Card style={{ elevation: 3, margin: 8 }}>
      <Card.Content
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Text>name: {item?.name} </Text>
        <Text>${item?.price}</Text>
        <IconButton icon="trash-can" size={20} onPress={onRemoveItem} />
      </Card.Content>
    </Card>
  );
};
