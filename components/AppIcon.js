// components/AppIcon.js
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function AppIcon() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/event-buddy-logo.png')}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
