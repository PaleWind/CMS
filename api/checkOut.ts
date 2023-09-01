import {
  CartItem,
  CartItemDetails,
  EventEnrollment,
  getCartItemType,
} from '../types/types';
import { supabase } from '../client';
import { eventParentIdFields } from '../types/constants';

export const processCartItems = async (
  enrollments: any,
  apperalProducts: any
) => {
  enrollments && enrollInEvents(enrollments);
  apperalProducts && createShippingLabel(apperalProducts);
};

export const rollbackCartItems = async (
  enrollments: any,
  apperalProducts: any
) => {
  enrollments && deleteEventEnrollments(enrollments);
  // apperalProducts && createShippingLabel(apperalProducts);
};

export const groupCartItems = (
  userId: string,
  cartItems: CartItemDetails[]
) => {
  const enrollments = [] as any[];
  const apperalProducts = [] as any[];
  for (let cartItem of cartItems) {
    const cartItemType = getCartItemType(cartItem);
    if (
      cartItemType === 'tournament_events' ||
      cartItemType === 'camp_events' ||
      cartItemType === 'league_events'
    ) {
      const field = eventParentIdFields[cartItemType];
      const activityId = cartItem[field as keyof typeof cartItem];
      enrollments.push({
        user_id: userId,
        event_type: cartItemType,
        activity_id: activityId,
        event_id: cartItem.id,
      } as EventEnrollment);
    } else if (cartItemType === 'apperal_products') {
      apperalProducts.push(cartItem);
    }
  }
  return { enrollments, apperalProducts };
};

export const enrollInEvents = async (enrollments: EventEnrollment[]) => {
  console.log('enrollment', enrollments);
  const { data, error } = await supabase
    .from('event_enrollments')
    .insert(enrollments);

  if (error) {
    console.log('Error enrolling:', error.message);
    throw error;
  } else {
    return data;
  }
};

export const deleteEventEnrollments = async (
  enrollments: EventEnrollment[]
) => {
  const errors = [];
  const removedEnrollments = [];
  for (let enrollback of enrollments) {
    const { data, error } = await supabase
      .from('event_enrollments')
      .delete()
      .eq('user_id', enrollback.user_id)
      .eq('event_type', enrollback.event_type)
      .eq('activity_id', enrollback.activity_id)
      .eq('event_id', enrollback.event_id);

    if (error) {
      console.log('Error enrolling:', error.message);
      errors.push(error);
    } else {
      removedEnrollments.push(enrollback);
    }
  }
  if (errors.length) {
    console.log('errors rolling back ', errors);
    throw errors[0];
  }
  console.log('rollback success ', removedEnrollments);
};

export const createShippingLabel = async (apperalItems: any) => {
  console.log('coming soon');
};
