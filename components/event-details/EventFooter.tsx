import { View, Text, TouchableOpacity, Image } from 'react-native';
import icons from '../../theme/icons';
import { footerStyles } from '../../theme/styles/footer';
import { useAppSelector } from '../../redux/hooks';
import { shoppingCartStatusSelector } from '../../redux/slices/ShoppingCartSlice';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../theme/theme';

export const EventFooter = ({
  userId,
  canAddToCart,
  onAddToCart,
}: {
  userId: string | undefined;
  canAddToCart: boolean;
  onAddToCart: any;
}) => {
  const status = useAppSelector(shoppingCartStatusSelector);
  return (
    <View style={footerStyles.container}>
      <TouchableOpacity style={footerStyles.likeBtn}>
        <Image
          source={icons.heartOutline}
          resizeMode="contain"
          style={footerStyles.likeBtnImage}
        />
      </TouchableOpacity>

      {userId ? (
        <>
          {status === 'loading' ? (
            <ActivityIndicator />
          ) : canAddToCart ? (
            <TouchableOpacity
              style={[
                footerStyles.actionBtn,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={onAddToCart}
            >
              <Text style={footerStyles.actionBtnText}>Add to cart</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[footerStyles.actionBtn, { backgroundColor: COLORS.gray }]}
              disabled={true}
            >
              <Text style={footerStyles.actionBtnText}>
                Item already in cart
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={[footerStyles.actionBtn, { backgroundColor: COLORS.gray }]}
          disabled={true}
        >
          <Text style={footerStyles.actionBtnText}>Sign in to play</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
