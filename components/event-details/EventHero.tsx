import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../../theme/theme';
import icons from '../../theme/icons';
import Icon from 'react-native-vector-icons/FontAwesome';

export const EventHero = ({
  name,
  parentName,
  startDate,
  price,
  enrollmentCount,
  maxPlayers,
}: {
  name: string;
  parentName: string;
  startDate: Date | null;
  price: number;
  enrollmentCount: number;
  maxPlayers: number;
}) => {
  const formattedParentName =
    parentName.length > 10 ? parentName.slice(0, 8) + '..' : parentName;
  return (
    <View style={styles.container} id="hero-id">
      {/* <View style={styles.logoBox}>
        <Image
          source={{
            uri: checkImageURL(companyLogo)
              ? companyLogo
              : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg",
          }}
          style={styles.logoImage}
        />
      </View> */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.info}>{parentName}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.info}>{startDate?.toString().slice(0, 10)}</Text>
        <View style={styles.locationBox}></View>
      </View>
      <Text style={styles.info}>${price}</Text>
      <View style={styles.infoBox}>
        <Icon name="user" size={20} color={COLORS.gray} />
        <Text style={styles.info}>
          {enrollmentCount}/{maxPlayers}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: SIZES.large,
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  titleBox: {
    marginTop: SIZES.small,
  },
  title: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontFamily: FONT.bold,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: SIZES.small / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: SIZES.medium - 2,
    color: COLORS.primary,
    fontFamily: FONT.medium,
  },
  locationBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationImage: {
    width: 14,
    height: 14,
    tintColor: COLORS.gray,
  },
  info: {
    fontSize: SIZES.medium - 2,
    color: COLORS.gray,
    fontFamily: FONT.regular,
    marginLeft: 2,
  },
});
