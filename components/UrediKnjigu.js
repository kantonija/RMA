import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; 
import PageDesign from "./ui/PageDesign";
import Toast from 'react-native-toast-message'; 
import { supabase } from '../supabaseClient';

export default function UrediKnjigu({ route, navigation }) {
  const { bookId } = route.params; 

  const [naslovKnjige, setNaslovKnjige] = useState("");
  const [autorKnjige, setAutorKnjige] = useState("");
  const [zanrKnjige, setZanrKnjige] = useState("");
  const [brojStranica, setBrojStranica] = useState("");
  const [coverImage, setCoverImage] = useState("");


  const fetchBookData = async () => {
    try {
      const bookRef = doc(firestore, "books", bookId);
      const bookSnap = await getDoc(bookRef);

      if (bookSnap.exists()) {
        const bookData = bookSnap.data();
        setNaslovKnjige(bookData.title);
        setAutorKnjige(bookData.author);
        setZanrKnjige(bookData.genre);
        setBrojStranica(bookData.pageCount);
        setCoverImage(bookData.coverImage || ""); 
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Greška',
          text2: 'Podaci o knjizi nisu pronađeni.',
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka o knjizi:", error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Greška',
        text2: 'Nije moguće dohvatiti podatke o knjizi.',
      });
    }
  };

  const handleUpdateBook = async () => {
    if (!naslovKnjige || !autorKnjige || !zanrKnjige || !brojStranica) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Greška',
        text2: 'Molimo popunite sva polja.',
      });
      return;
    }

    try {
      const bookRef = doc(firestore, "books", bookId);
      await updateDoc(bookRef, {
        title: naslovKnjige,
        author: autorKnjige,
        genre: zanrKnjige,
        pageCount: brojStranica,
        coverImage: coverImage,
      });

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Uspjeh',
        text2: 'Podaci o knjizi su uspješno ažurirani.',
      });
      navigation.goBack(); 
    } catch (error) {
      console.error("Greška pri ažuriranju knjige:", error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Greška',
        text2: 'Nije moguće ažurirati knjigu. Pokušajte ponovo.',
      });
    }
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  return (
    <PageDesign showCentralCircle={false}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Naslov knjige"
          value={naslovKnjige}
          onChangeText={(text) => setNaslovKnjige(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor knjige"
          value={autorKnjige}
          onChangeText={(text) => setAutorKnjige(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Žanr knjige"
          value={zanrKnjige}
          onChangeText={(text) => setZanrKnjige(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Broj stranica"
          value={brojStranica}
          keyboardType="numeric"
          onChangeText={(text) => setBrojStranica(text)}
        />

        <View style={styles.imagePlaceholder}>
          {coverImage ? (
            <Image source={{ uri: coverImage }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={50} color="black" />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdateBook}>
          <Text style={styles.buttonText}>Spremi promjene</Text>
        </TouchableOpacity>
      </View>

      <Toast ref={(ref) => Toast.setRef(ref)} />  {/* dodaj Toast komponentu */}
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width:'95%'
  },
  input: {
    width: "90%",
    height: 40,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    backgroundColor: "#FFFFFF",
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#A889E6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width:'70%'
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  },
});
