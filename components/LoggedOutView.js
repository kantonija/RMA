import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Input from "./ui/Input";
import Button from "./ui/Button";
import ErrorMessage from "./ui/ErrorMessage";
import { AuthContext } from "../AuthContext";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function LoggedOutView() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const[isRegistering, setIsRegistering] = useState(false);

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
  const handleRegister = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, passw)
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
    <View style={[styles.container, { padding: width > 600 ? 40 : 20 }]}>
      <View style={[styles.circle, styles.lightpinkCircle]} />
      <View style={[styles.circle, styles.purpleCircle]} />
      <View style={[styles.circle, styles.pinkCircle]} />

      <Text style={[styles.title, { fontSize: width > 600 ? 38 : 33 }]}>
        Dobrodošli{'\n'}natrag!
      </Text>

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
      <Button 
      title={loading ? "Učitavanje..." : isRegistering ? "Registracija" : "Prijava"} 
      onPress={isRegistering ? handleRegister : handleLogin} 
      />

      <View style={styles.signIn}>
        <Text style={styles.signInText}>
          {isRegistering ? "Već imate račun?" : "Nemate račun?"}
          </Text>
        <Button 
        title={isRegistering ? "Login" : "Sign up"}
         onPress={() => setIsRegistering(!isRegistering)}
          />
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
    top: "15%",
    left: "5%",
    fontWeight: "bold",
    color: "#4a148c",
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
  inputWithMargin: {
    marginBottom: 20,
    width: "80%",
  },
  signIn: {
    position: "absolute",
    bottom: "5%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  signInText: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
});
