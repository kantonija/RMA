import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import PageDesign from "./ui/PageDesign";

const { width} = Dimensions.get("window");


export default function UrediProfil() {
  const [najdrazaKnjiga, setNajdrazaKnjiga] = useState("");
  const [najdraziPisac, setNajdraziPisac] = useState("");
  const [najdraziZanr, setNajdraziZanr] = useState("");

  const handleSetPhoto = () => {
  };

  const handleRemovePhoto = () => {
  };

  return (
   <PageDesign>
    <View>
      <View/>

      <Text style={styles.title}>Vaši podaci:</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarPlaceholder}>avatar</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSetPhoto}>
        <Text style={styles.buttonText}>Postavi profilnu fotografiju</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleRemovePhoto}>
        <Text style={styles.buttonText}>Ukloni fotografiju</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Najdraža knjiga"
        value={najdrazaKnjiga}
        onChangeText={setNajdrazaKnjiga}
      />
      <TextInput
        style={styles.input}
        placeholder="Najdraži pisac"
        value={najdraziPisac}
        onChangeText={setNajdraziPisac}
      />
      <TextInput
        style={styles.input}
        placeholder="Najdraži žanr"
        value={najdraziZanr}
        onChangeText={setNajdraziZanr}
      />
    </View>
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6c4255",
    top: width > 600 ? -115 : 20,
    left: width > 600 ? -650 : -95,
  },
  avatar: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 1000,
    width: 100,
    height: 100,
    position: 'absolute',
    top: 10,
    right: -100,
  },
  avatarPlaceholder: {
    color: "#fff",
    fontWeight: "bold",
    top:30,
    right:-25
  },
  button: {
    backgroundColor: "#7b5e96",
    width:180,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    top: width > 600 ? -80 : 70,
    left:10
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign:'center'
  },
  input: {
    width: 200,
    height: 35,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    top: width > 600 ? -85 : 70
  },
});
