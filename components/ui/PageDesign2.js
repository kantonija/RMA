import React, { Children } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PageDesign2 = ({ children }) => {
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
      <View style={styles.circle9} />
      <View style={styles.circle10} />
      <View style={styles.circle11} />
      <View style={styles.circle12} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1D8F8',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
  circle1: {
    flex: 1,
    backgroundColor: '#FCA0F8',
    borderRadius: 500,
    width: 350,
    height: 350,
    position: 'absolute',
    top: 55,
  },
  circle2: {
    flex: 1,
    backgroundColor: '#DECFE1',
    borderRadius: 1000,
    width: 150,
    height: 150,
    position: 'absolute',
    top: 450,
    left: 45,
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
  circle9: {
    flex: 1,
    backgroundColor: '#C8A1C7',
    borderRadius: 950,
    width: 30,
    height: 30,
    position: 'absolute',
    top: 320,
    left: 450,
  },
  circle10: {
    flex: 1,
    backgroundColor: '#C8A1C7',
    borderRadius: 300,
    width: 65,
    height: 65,
    position: 'absolute',
    top: 360,
    left: 460,
  },
  circle11: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 600,
    width: 90,
    height: 90,
    position: 'absolute',
    top: 250,
    right: 300,
  },
  circle12: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 950,
    width: 200,
    height: 200,
    position: 'absolute',
    top: 500,
    left: 900,
  },
});

export default PageDesign2;