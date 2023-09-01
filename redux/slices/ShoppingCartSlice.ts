import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { supabase } from '../../client';
import { CartItemDetails, getEventType } from '../../types/types';
import {
  enrollInEvents,
  groupCartItems,
  processCartItems,
  rollbackCartItems,
} from '../../api/checkOut';
import { signOutThunk } from './AuthSlice';

export interface CartState {
  data: { cartItems: CartItemDetails[]; checkOut: {} };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: CartState = {
  data: { cartItems: [], checkOut: {} },
  status: 'idle',
  error: undefined,
};

export const getShoppingCartItemsThunk = createAsyncThunk(
  'cart/getShoppingCartItemsThunk',
  async ({ userId }: { userId: string | undefined }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`*`)
        .eq('user_id', userId);
      if (error) throw error;

      const itemsMap = new Map();
      for (let item of data as any[]) {
        if (itemsMap.has(item.product_category)) {
          itemsMap.get(item.product_category).push(item.product_id);
        } else {
          itemsMap.set(item.product_category, [item.product_id]);
        }
      }
      let itemsWithDetails = [] as CartItemDetails[];
      for (let table of itemsMap.keys()) {
        const { data: items, error } = await supabase
          .from(table)
          .select('*')
          .in('id', itemsMap.get(table));
        itemsWithDetails = itemsWithDetails.concat(items as CartItemDetails[]);
      }
      return { itemsWithDetails };
    } catch (error) {
      console.log('Error fetching cart item:', error);
      return rejectWithValue(error);
    }
  }
);

export const addShoppingCartItemThunk = createAsyncThunk(
  'cart/addShoppingCartItem',
  async (
    {
      userId,
      cartItem,
    }: { userId: string | undefined; cartItem: CartItemDetails },
    { rejectWithValue }
  ) => {
    try {
      const table = getEventType(cartItem);
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_category: table,
          product_id: cartItem.id,
        })
        .select();
      if (error) throw error;
      return cartItem;
    } catch (error) {
      console.log('addShoppingCartItem error: ', error);
      return rejectWithValue({});
    }
  }
);

export const removeShoppingCartItemThunk = createAsyncThunk(
  'cart/removeShoppingCartItemThunk',
  async (
    { userId, cartItemId }: { userId: string | undefined; cartItemId: number },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', cartItemId)
        .select();
      if (error) throw error;
      console.log('cart item removed:', data);
      return { cartItemId };
    } catch (error) {
      console.log('Error removing cart item:', error);
      return rejectWithValue(error);
    }
  }
);

export const checkOutThunk = createAsyncThunk(
  'cart/checkOutThunk',
  async ({}: {}, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    let cartItems = state.shoppingCart.data.cartItems;
    let userId = state.auth.data.currentSession?.user.id;
    if (!userId || !cartItems) return { succeeded: false };
    const { enrollments, apperalProducts } = groupCartItems(userId, cartItems);
    console.log('cart items:', cartItems);
    try {
      processCartItems(enrollments, apperalProducts).then(async () => {
        const { data, error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);
      });
      return { succeeded: true };
    } catch (error) {
      console.log('Error processing cart items:', error);
      rollbackCartItems(enrollments, apperalProducts);
      return rejectWithValue({ succeeded: false });
    }
  }
);

export const clearShoppingCartItemsThunk = createAsyncThunk(
  'cart/clearShoppingCartItemsThunk',
  async ({ userId }: { userId: string | undefined }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) console.log('cart items removed:', data);
      return { data };
    } catch (error) {
      console.log('Error removing cart item:', error);
      return rejectWithValue(error);
    }
  }
);

export const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getShoppingCartItemsThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getShoppingCartItemsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { itemsWithDetails } = action.payload;
        //if (state.data != items)
        state.data.cartItems = itemsWithDetails as any;
      })
      .addCase(getShoppingCartItemsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addShoppingCartItemThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.cartItems.push(action.payload as any);
      })
      .addCase(addShoppingCartItemThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        const item = action.payload;
        console.log('addShoppingCartItem.rejected:', item);
      })
      .addCase(removeShoppingCartItemThunk.fulfilled, (state, action) => {
        const { cartItemId } = action.payload;
        state.data.cartItems = state.data.cartItems.filter(
          (item) => item.id !== cartItemId
        );
      })
      .addCase(removeShoppingCartItemThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(clearShoppingCartItemsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.cartItems = [];
      })
      .addCase(clearShoppingCartItemsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(checkOutThunk.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(checkOutThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { succeeded } = action.payload;
        if (!succeeded) return;
        state.data.cartItems = [];
      })
      .addCase(checkOutThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signOutThunk.pending, (state, action) => {
        state = initialState;
      });
  },
});

export const shoppingCartItemsSelector = (state: RootState) => {
  return state.shoppingCart.data.cartItems;
};

export const itemExistsInCartSelector = (
  state: RootState,
  cartItem: CartItemDetails
): boolean => {
  let keys = Object.keys(cartItem);
  // console.log('cartItem:', cartItem, keys);
  if (
    state.shoppingCart.data.cartItems.find((item: CartItemDetails) => {
      // console.log('item:', item, Object.keys(item));
      return (
        keys.length === Object.keys(item).length &&
        keys.every(
          (key) =>
            // item.hasOwnProperty(key) &&
            item[key as keyof typeof item] ===
            cartItem[key as keyof typeof cartItem]
        )
      );
    })
  ) {
    // console.log('item already in cart');
    return true;
  }
  // console.log('item not found in cart');
  return false;
};

export const shoppingCartStatusSelector = (state: RootState) => {
  return state.shoppingCart.status;
};

export const {} = shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
