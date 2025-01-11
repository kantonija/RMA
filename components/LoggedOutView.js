import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions, Alert } from "react-native";
import Input from "./ui/Input";
import Button from "./ui/Button";
import ErrorMessage from "./ui/ErrorMessage";
import AnimatedCircles from "./AnimatedCircles";
import { AuthContext } from "../AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get("window");

export default function LoggedOutView() {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [confirmPassw, setConfirmPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, passw);
      const user = userCredential.user;
  
      console.log("Prijava uspješna!", user); 
  
      const docRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const name = docSnap.data().name;
        console.log("Ime korisnika iz Firestore-a:", name);
  
        login(user, name);
      } else {
        console.log('Korisnik nije pronađen u bazi.');
        setErrorMsg('Pogrešno ime ili lozinka.');
      }
    } catch (err) {
      console.error('Greška pri prijavi:', err.message);
      setErrorMsg('Pogrešno ime ili lozinka.');
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async () => {
    if (passw !== confirmPassw) {
      setErrorMsg("Lozinke se ne podudaraju.");
      return;
    }
  
    if (!name) {
      setErrorMsg("Ime je obavezno.");
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, passw);
      const userId = userCredential.user.uid;
  
      await setDoc(doc(firestore, "users", userId), {
        name: name, 
        email: email,
        dateJoined: new Date().toISOString(),
      });
  
      Alert.alert("Registracija je uspješno dovršena!");
      login(userCredential.user, name);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={[styles.container, { padding: width > 600 ? 40 : 20 }]}>
      <AnimatedCircles />

      <Text style={[styles.title, { fontSize: width > 600 ? 38 : 33 }]}>Dobrodošli{"\n"}{isRegistering ? "Registracija" : "natrag!"}</Text>

      {isRegistering && ( 
        <Input
          style={styles.inputWithMargin}
          placeholder="Ime"
          value={name}
          onChangeText={setName}
        />
      )}
          
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

