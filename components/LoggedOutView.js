import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Input from "./ui/Input";
import Button from "./ui/Button";
import ErrorMessage from "./ui/ErrorMessage";
import AnimatedCircles from "./AnimatedCircles";
import { AuthContext } from "../AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function LoggedOutView() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [confirmPassw, setConfirmPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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
    if (passw !== confirmPassw) {
      setErrorMsg("Lozinke se ne podudaraju.");
      return;
    }
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
      <AnimatedCircles />

      <Text style={[styles.title, { fontSize: width > 600 ? 38 : 33 }]}>Dobrodošli{"\n"}{isRegistering ? "Registracija" : "natrag!"}</Text>

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
      {isRegistering && (
        <Input
          style={styles.inputWithMargin}
          placeholder="Potvrdite lozinku"
          secureTextEntry={true}
          value={confirmPassw}
          onChangeText={setConfirmPassw}
        />
      )}
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

