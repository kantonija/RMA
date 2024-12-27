import React from "react"
import { TextInput, StyleSheet} from "react-native";

export default function LoginInput ({placeholder, value, onChangeText, secureTextEntry}) {
    return (
        <TextInput
             style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText} 
            secureTextEntry={secureTextEntry}
        />
    );
}
const styles = StyleSheet.create({
    input: {
      width: '65%',  
      height: 40, 
      borderWidth: 1, 
      borderColor: "#ccc", 
      borderRadius: 8, 
      paddingHorizontal: 10, 
      backgroundColor: "#fff", 
      fontSize: 14, 
      marginBottom: 10, 
      alignSelf: 'center',  
    },
    inputWithMargin: {
      marginBottom: 54, 
    },
});

