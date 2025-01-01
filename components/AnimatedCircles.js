import React from "react";
import { View, StyleSheet, Dimensions, Animated, Easing } from "react-native";

const { width, height } = Dimensions.get("window");

export default function AnimatedCircles() {
  const animatedValue1 = React.useRef(new Animated.Value(0)).current;
  const animatedValue2 = React.useRef(new Animated.Value(0)).current;
  const animatedValue3 = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const createAnimation = (value, duration, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration,
            delay,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = createAnimation(animatedValue1, 4000, 0);
    const animation2 = createAnimation(animatedValue2, 4000, 1000);
    const animation3 = createAnimation(animatedValue3, 4000, 2000);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [animatedValue1, animatedValue2, animatedValue3]);

  const interpolatedScale1 = animatedValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const interpolatedScale2 = animatedValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const interpolatedScale3 = animatedValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          styles.lightpinkCircle,
          { transform: [{ scale: interpolatedScale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.purpleCircle,
          { transform: [{ scale: interpolatedScale2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.pinkCircle,
          { transform: [{ scale: interpolatedScale3 }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
  },
  lightpinkCircle: {
    backgroundColor: "#f6e2ee",
    width: width * 0.9,
    height: width * 0.9,
    top: height * 0.01,
    left: -width * 0.1,
  },
  purpleCircle: {
    backgroundColor: "#d6bcfa",
    width: width * 0.9,
    height: width * 0.9,
    top: height * 0.5,
    left: -width * 0.3,
  },
  pinkCircle: {
    backgroundColor: "#fdc0c7",
    width: width * 0.9,
    height: width * 0.9,
    top: height * 0.3,
    left: width * 0.3,
  },
});
