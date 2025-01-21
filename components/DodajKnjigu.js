import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, getDocs, setDoc, query, orderBy, where, doc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import PageDesign from "./ui/PageDesign";
import Toast from "react-native-toast-message";
import { supabase } from "../supabaseClient";
import * as ImagePicker from "expo-image-picker";

export default function DodajKnjigu({ navigation }) {
  const [naslovKnjige, setNaslovKnjige] = useState("");
  const [noviAutor, setNoviAutor] = useState("");
  const [zanrKnjige, setZanrKnjige] = useState("");
  const [brojStranica, setBrojStranica] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [nextAuthorId, setNextAuthorId] = useState(null);
  const [nextBookId, setNextBookId] = useState(null);

  useEffect(() => {
    fetchNextAuthorId();
    fetchNextBookId();
  }, []);

  // Fetch the next Author ID based on the highest existing ID
  const fetchNextAuthorId = async () => {
    try {
      const authorsRef = collection(firestore, "authors");
      const q = query(authorsRef, orderBy("id", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastAuthor = querySnapshot.docs[0].data();
        const lastId = parseInt(lastAuthor.id.replace("author", ""), 10);
        setNextAuthorId(lastId + 1);  // Increment the highest ID by 1
      } else {
        setNextAuthorId(1);  // If no authors exist, start with 1
      }
    } catch (error) {
      console.error("Error fetching next author ID:", error);
      setNextAuthorId(1);  // Default to 1 if there's an error
    }
  };

  // Fetch the next Book ID based on the highest existing ID
  const fetchNextBookId = async () => {
    try {
      const booksRef = collection(firestore, "books");
      const q = query(booksRef, orderBy("id", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastBook = querySnapshot.docs[0].data();
        const lastId = parseInt(lastBook.id.replace("book", ""), 10);
        setNextBookId(lastId + 1);  // Increment the highest ID by 1
      } else {
        setNextBookId(1);  // If no books exist, start with 1
      }
    } catch (error) {
      console.error("Error fetching next book ID:", error);
      setNextBookId(1);  // Default to 1 if there's an error
    }
  };

  // Check if the author already exists in Firestore
  const checkAuthorExists = async (authorName) => {
    const authorsRef = collection(firestore, "authors");
    const q = query(authorsRef, where("name", "==", authorName));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  // Add a new author to Firestore
  const addAuthor = async (authorName) => {
    try {
      const authorRef = doc(firestore, "authors", `author${nextAuthorId}`);
      await setDoc(authorRef, {
        id: `author${nextAuthorId}`,
        name: authorName,
        bio: "",  // Optional: Can be modified later
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Author added successfully!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add author. Please try again.",
      });
      console.error("Error adding author:", error);
    }
  };

  // Add a new book to Firestore
  const handleAddBook = async () => {
    if (!naslovKnjige || !noviAutor || !zanrKnjige || !brojStranica) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    try {
      let authorToSave = noviAutor;

      // Check if the author already exists in the database
      const authorExists = await checkAuthorExists(noviAutor);
      if (!authorExists) {
        // If the author doesn't exist, add them to Firestore
        await addAuthor(noviAutor);
        authorToSave = noviAutor;
      }

      // Add the book to Firestore
      await setDoc(doc(firestore, "books", `book${nextBookId}`), {
        id: `book${nextBookId}`,
        title: naslovKnjige,
        author: authorToSave,
        genre: zanrKnjige,
        pageCount: brojStranica,
        coverImage: coverImage || "",
      });

      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Success",
        text2: "Book added successfully.",
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error adding book:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "Failed to add book. Please try again.",
      });
    }
  };

  // Handle image upload for cover image
  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "You must grant access to the gallery.",
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
          .from("book-images")
          .upload(`cover_images/${Date.now()}_${fileName}`, fileBlob, {
            contentType: type,
          });

        if (error) throw error;

        const publicUrl = supabase.storage
          .from("book-images")
          .getPublicUrl(data.path).data.publicUrl;

        setCoverImage(publicUrl);
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Success",
          text2: "Image successfully uploaded.",
        });
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: "Failed to upload image.",
        });
      }
    }
  };

  return (
    <PageDesign showCentralCircle={false}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={styles.input}
            placeholder="Naziv"
            value={naslovKnjige}
            onChangeText={(text) => setNaslovKnjige(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Autor"
            value={noviAutor}
            onChangeText={(text) => setNoviAutor(text)}
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

          <TouchableOpacity style={styles.button} onPress={handleAddBook}>
            <Text style={styles.buttonText}>Dodaj knjigu</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  
  viewstyle: {
    flex: 1,
    marginTop: '10%',
    justifyContent: 'center',
    alignContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems:'center',
  },
  input: {
    width: "95%",
    marginTop: 20,
    height: 45,
    borderWidth: 2,
    borderColor: "#A889E6",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  imageButton: {
    marginTop: 30,
    width: "80%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#6c4255",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 30,
    width: "80%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#A889E6",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  coverImage: {
    width: 150,
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
});
