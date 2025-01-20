import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import PageDesign from "./ui/PageDesign";
import Toast from "react-native-toast-message";

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
        Toast.show({
          type: "error",
          text1: "Greška",
          text2: "Podaci o autoru nisu pronađeni.",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka o autoru:", error);
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Nije moguće dohvatiti podatke o autoru.",
      });
    }
  };

  const handleUpdateAuthor = async () => {
    if (!imeAutora) {
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Ime autora ne smije biti prazno.",
      });
      return;
    }

    try {
      const authorRef = doc(firestore, "authors", authorId);
      await updateDoc(authorRef, {
        name: imeAutora,
        bio: biografijaAutora,
      });

      Toast.show({
        type: "success",
        text1: "Uspjeh",
        text2: "Podaci o autoru su uspješno ažurirani.",
      });
      navigation.goBack();
    } catch (error) {
      console.error("Greška pri ažuriranju autora:", error);
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Nije moguće ažurirati podatke o autoru. Pokušajte ponovo.",
      });
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
      <Toast />
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width: '90%',
  },
  input: {
    width: '95%',
    height: '20%',
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
    color: '#63042F',
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
