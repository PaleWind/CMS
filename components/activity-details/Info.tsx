import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../../theme/theme';
import { Activity } from '../../types/types';

export const Info = ({ item }: { item: any }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoCintainer}>
        <Text style={styles.title}>{item?.name}</Text>
        <View style={styles.infoWrapper}>
          <Text style={styles.infoText}>{item?.start_date}</Text>
        </View>
        <View style={styles.infoWrapper}>
          <Text>{item.location}</Text>
        </View>
        <Text>{item.venue}</Text>
        <View style={styles.infoWrapper}>
          <Text>{item?.start_date}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
    backgroundColor: '#FFF',
    borderRadius: SIZES.medium,
    padding: SIZES.medium,
  },
  title: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontFamily: FONT.bold,
  },
  infoCintainer: {
    marginVertical: SIZES.small,
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: SIZES.small / 1.25,
  },
  infoText: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    fontFamily: FONT.regular,
    marginLeft: SIZES.small,
  },
});
