import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONT, SIZES } from '../../theme/theme';
import icons from '../../theme/icons';
import { Activity } from '../../types/types';

export const ActivityHero = ({
  name,
  location,
  venue,
  startDate,
  endDate,
}: {
  name: string;
  location: string | null;
  venue: string | null;
  startDate: Date | null;
  endDate: Date | null;
}) => {
  return (
    <View style={styles.container}>
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
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.info}>
          {startDate?.toString() + ' - ' + endDate?.toString()}
        </Text>
        <View style={styles.locationBox}></View>
      </View>
      <View style={styles.infoRow}>
        <Image
          source={icons.location}
          resizeMode="contain"
          style={styles.locationImage}
        />
        <Text style={styles.info}>{venue}</Text>
        <Text style={styles.info}>{location}</Text>
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
  infoRow: {
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
