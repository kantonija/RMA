import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import PageDesign from "./ui/PageDesign";
import Toast from 'react-native-toast-message';
import { supabase } from '../supabaseClient';
import * as ImagePicker from 'expo-image-picker';

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

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Greška',
        text2: 'Morate omogućiti pristup galeriji.',
      });
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedImage = pickerResult.assets[0];
      const { uri, fileName, type } = selectedImage;

      try {
        const fileBlob = await fetch(uri).then((res) => res.blob());

        const { data, error } = await supabase.storage
          .from('book-images')
          .upload(`cover_images/${Date.now()}_${fileName}`, fileBlob, {
            contentType: type,
          });

        if (error) throw error;

        const publicUrl = supabase.storage
          .from('book-images')
          .getPublicUrl(data.path).data.publicUrl;

        setCoverImage(publicUrl);
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Uspjeh',
          text2: 'Slika je uspješno dodana.',
        });
      } catch (uploadError) {
        console.error("Greška pri uploadu slike:", uploadError);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Greška',
          text2: 'Nije moguće uploadati sliku.',
        });
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!coverImage) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Greška',
        text2: 'Nema slike za brisanje.',
      });
      return;
    }

    try {
      const fileName = coverImage.split('/').pop().split('?')[0]; // Izdvaja naziv datoteke iz URL-a

      const { error } = await supabase.storage
        .from('book-images')
        .remove([`cover_images/${fileName}`]);

      if (error) throw error;

      setCoverImage("");
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Uspjeh',
        text2: 'Slika je uspješno obrisana.',
      });
    } catch (error) {
      console.error("Greška pri brisanju slike:", error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Greška',
        text2: 'Nije moguće obrisati sliku. Pokušajte ponovo.',
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
            <Text style={styles.buttonText}>Dodaj sliku</Text>
          </TouchableOpacity>

          {coverImage ? (
            <TouchableOpacity style={styles.button} onPress={handleDeleteImage}>
              <Text style={styles.buttonText}>Obriši sliku</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleUpdateBook}>
            <Text style={styles.buttonText}>Spremi promjene</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width: '95%',
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
    width: '70%',
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
});
