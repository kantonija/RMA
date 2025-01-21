import React from "react";
import { TouchableOpacity, Text, StyleSheet} from "react-native";

export default function LoginButton ({title, onPress}) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
      width: '29%', 
      maxWidth: 150, 
      height: 35,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#986BFC",
      backgroundColor: "#986BFC",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });