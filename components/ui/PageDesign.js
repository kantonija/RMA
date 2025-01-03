import React, { Children } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PageDesign = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
      <View style={styles.circle4} />
      <View style={styles.circle5} />
      <View style={styles.circle6} />
      <View style={styles.circle7} />
      <View style={styles.circle8} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf1f4',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
  circle1: {
    flex: 1,
    backgroundColor: '#f6e2ee',
    borderRadius: 1000,
    width: 300,
    height: 300,
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  circle2: {
    flex: 1,
    backgroundColor: '#d6bcfa',
    borderRadius: 1000,
    width: 100,
    height: 100,
    position: 'absolute',
    top: 450,
    left: 35,
  },
  circle3: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 1000,
    width: 150,
    height: 150,
    position: 'absolute',
    top: 370,
    right: 30,
  },
  circle4: {
    flex: 1,
    backgroundColor: '#d6bcfa',
    borderRadius: 1000,
    width: 100,
    height: 100,
    position: 'absolute',
    top: 550,
    right: 130,
  },
  circle5: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 1000,
    width: 60,
    height: 60,
    position: 'absolute',
    top: 660,
    right: 30,
  },
  circle6: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 1000,
    width: 60,
    height: 60,
    position: 'absolute',
    top: 620,
    left: 70,
  },
  circle7: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 1000,
    width: 100,
    height: 100,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  circle8: {
    flex: 1,
    backgroundColor: '#d6bcfa',
    borderRadius: 1000,
    width: 60,
    height: 60,
    position: 'absolute',
    top: 300,
    left: 10,
  },
});

export default PageDesign;