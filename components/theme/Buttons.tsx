import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../theme/theme';

export const PrimaryButton = ({
  text,
  onPress,
}: {
  text: any;
  onPress: any;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn]}>
      <Text style={[styles.btnText]}></Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
  },
  btn: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.xLarge,
    borderRadius: SIZES.medium,
    marginLeft: 2,
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  btnText: {
    fontFamily: 'DMMedium',
    fontSize: SIZES.small,
  },
});
