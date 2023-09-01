import React, { useState } from 'react';
import {
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../../theme/theme';

function TabButton({
  name,
  activeTab,
  openTab,
}: {
  name: any;
  activeTab: any;
  openTab: any;
}) {
  return (
    <TouchableOpacity
      onPress={openTab}
      style={[
        styles.btn,
        { backgroundColor: name === activeTab ? COLORS.primary : COLORS.white },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          { color: name === activeTab ? COLORS.white : COLORS.primary },
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

export const Tabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: any;
  activeTab: any;
  setActiveTab: any;
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TabButton
            name={item}
            activeTab={activeTab}
            openTab={() => setActiveTab(item)}
          />
        )}
        contentContainerStyle={{ columnGap: SIZES.small / 2 }}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: SIZES.small / 2,
    justifyContent: 'center',
    alignItems: 'center',
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
