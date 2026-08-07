import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';


import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function LuxuryBackground(): React.JSX.Element {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View
        
        style={[styles.wash, styles.coralWash]}
      />
      <View
       
        style={[styles.wash, styles.creamWash]}
      />
      <View
       
        style={[styles.wash, styles.goldWash]}
      />
      <View style={styles.haloLarge} />
      <View style={styles.haloSmall} />
      <View style={styles.leftLine} />
      <View style={styles.rightLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blush,
    overflow: 'hidden',
  },
  wash: {
    position: 'absolute',
    borderRadius: 999,
  },
  coralWash: {
    width: width * 1.25,
    height: width * 1.25,
    top: -width * 0.42,
    left: -width * 0.25,
    backgroundColor: colors.coral,
    opacity: 0.72,
  },
  creamWash: {
    width: width * 0.9,
    height: width * 0.9,
    top: height * 0.16,
    right: -width * 0.34,
    backgroundColor: colors.cream,
    opacity: 0.66,
  },
  goldWash: {
    width: width * 1.1,
    height: width * 1.1,
    bottom: -width * 0.42,
    right: -width * 0.24,
    backgroundColor: colors.amber,
    opacity: 0.48,
  },
  haloLarge: {
    position: 'absolute',
    width: width * 1.35,
    height: width * 1.35,
    borderRadius: (width * 1.35) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.34)',
    top: height * 0.08,
    left: -width * 0.22,
  },
  haloSmall: {
    position: 'absolute',
    width: width * 0.72,
    height: width * 0.72,
    borderRadius: (width * 0.72) / 2,
    borderWidth: 1,
    borderColor: 'rgba(91, 56, 55, 0.12)',
    top: height * 0.22,
    right: -width * 0.16,
  },
  leftLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    left: 38,
  },
  rightLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(91, 56, 55, 0.08)',
    right: 38,
  },
});
