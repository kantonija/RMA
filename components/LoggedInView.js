import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "./ui/Button"; 
import { AuthContext } from "../AuthContext";  
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoggedInView() {
  const { user, logout } = useContext(AuthContext); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dobrodošli!</Text>

      <Button title="Odjava" onPress={handleLogout} /> {}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4a148c",
    marginBottom: 20,
  },
});
