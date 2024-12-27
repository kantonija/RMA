import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Input from "./ui/Input";
import Button from "./ui/Button";
import ErrorMessage from "./ui/ErrorMessage";
import { AuthContext } from "../AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function LoggedOutView() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, passw)
      .then(() => {
        setLoading(false);
        login();
      })
      .catch((error) => {
        setLoading(false);
        setErrorMsg(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.lightpinkCircle]} />
      <View style={[styles.circle, styles.purpleCircle]} />
      <View style={[styles.circle, styles.pinkCircle]} />

      <Text style={styles.title}>Dobrodošli natrag!</Text>

      <Input
        placeholder="E-mail"
        value={email}
        secureTextEntry={false}
        onChangeText={setEmail}
      />
      <Input
        style={styles.inputWithMargin}
        placeholder="Lozinka"
        secureTextEntry={true}
        value={passw}
        onChangeText={setPassw}
      />
      <ErrorMessage error={errorMsg} />
      <Button title={loading ? "Učitavanje..." : "Prijava"} onPress={handleLogin} />

      {}
      <View style={styles.signIn}>
        <Text style={styles.signInText}>Nemate račun?</Text>
        <Button title="Sign up" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  title: {
    position: "absolute",
    top: "20%",
    left: 25,
    font: "Inconsolata",
    fontSize: 30,
    fontWeight: "bold",
    color: "#4a148c",
  },
  circle: {
    position: "absolute",
    borderRadius: 500,
  },
  lightpinkCircle: {
    width: width * 0.82, 
    height: height * 0.35,
    backgroundColor: "#f6e2ee",
    top: height * 0.02,
    left: width * -0.1,
  },
  purpleCircle: {
    width: width * 0.8,
    height: height * 0.35,
    backgroundColor: "#d6bcfa",
    top: height * 0.56,
    left: width * -0.15,
  },
  pinkCircle: {
    width: width * 0.85,
    height: height * 0.40,
    backgroundColor: "#fdc0C7",
    top: height * 0.3,
    left: width * 0.2,
  },
  inputWithMargin: {
    marginBottom: 20,
  },
  signIn: {
    position: "absolute",
    bottom: "5%", 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    width: "100%",
    paddingHorizontal: 20, 
  },
  signInText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10, 
  },
});

