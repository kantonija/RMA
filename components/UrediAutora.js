import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import PageDesign from "./ui/PageDesign";

export default function UrediAutora({ route, navigation }) {
  const { authorId } = route.params;

  const [imeAutora, setImeAutora] = useState("");
  const [biografijaAutora, setBiografijaAutora] = useState("");
  const [originalImeAutora, setOriginalImeAutora] = useState("");
  const [originalBiografijaAutora, setOriginalBiografijaAutora] = useState("");

  const fetchAuthorData = async () => {
    try {
      const authorRef = doc(firestore, "authors", authorId);
      const authorSnap = await getDoc(authorRef);

      if (authorSnap.exists()) {
        const authorData = authorSnap.data();
        setImeAutora(authorData.name || "");
        setBiografijaAutora(authorData.bio || "");
        setOriginalImeAutora(authorData.name || "");
        setOriginalBiografijaAutora(authorData.bio || "");
      } else {
        Alert.alert("Greška", "Podaci o autoru nisu pronađeni.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka o autoru:", error);
      Alert.alert("Greška", "Nije moguće dohvatiti podatke o autoru.");
    }
  };

  const handleUpdateAuthor = async () => {
    if (!imeAutora) {
      Alert.alert("Greška", "Ime autora ne smije biti prazno.");
      return;
    }

    try {
      const authorRef = doc(firestore, "authors", authorId);
      await updateDoc(authorRef, {
        name: imeAutora,
        bio: biografijaAutora,
      });

      Alert.alert("Uspjeh", "Podaci o autoru su uspješno ažurirani.");
      navigation.goBack();
    } catch (error) {
      console.error("Greška pri ažuriranju autora:", error);
      Alert.alert("Greška", "Nije moguće ažurirati podatke o autoru. Pokušajte ponovo.");
    }
  };

  useEffect(() => {
    fetchAuthorData();
  }, []);

  return (
    <PageDesign showCentralCircle={false}>
      <View style={styles.container}>
        <Text style={styles.label}>Ime autora</Text>
        <Text style={styles.text}>{originalImeAutora}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Unesite novo ime autora"
          value={imeAutora}
          onChangeText={(text) => setImeAutora(text)}
        />
        
        <Text style={styles.label}>Biografija autora</Text>
        <Text style={styles.text}>{originalBiografijaAutora}</Text>

        <TextInput
          style={styles.input}
          placeholder="Unesite novu biografiju autora"
          value={biografijaAutora}
          onChangeText={(text) => setBiografijaAutora(text)}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdateAuthor}>
          <Text style={styles.buttonText}>Spremi promjene</Text>
        </TouchableOpacity>
      </View>
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "90%",
    height: 100,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "flex-start",
    width: "90%",
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    alignSelf: "flex-start",
    width: "90%",
  },
  button: {
    backgroundColor: "#A889E6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
