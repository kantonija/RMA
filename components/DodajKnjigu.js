import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { collection, setDoc, doc, getDocs, query, orderBy, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import PageDesign from "./ui/PageDesign";
import { AuthContext } from "../AuthContext";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseClient";

const DodajKnjigu = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [genre, setGenre] = useState("");
  const [nextBookId, setNextBookId] = useState("");
  const [nextAuthorId, setNextAuthorId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchNextBookId = async () => {
    try {
      const booksRef = collection(firestore, "books");
      const q = query(booksRef, orderBy("id", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastBook = querySnapshot.docs[0].data();
        const lastId = parseInt(lastBook.id.replace("book", ""), 10);
        setNextBookId(`book${lastId + 1}`);
      } else {
        setNextBookId("book1");
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju ID-a knjige:", error);
    }
  };


  const fetchNextAuthorId = async () => {
    try {
      const authorsRef = collection(firestore, "authors");
      const q = query(authorsRef, orderBy("id", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const lastAuthor = querySnapshot.docs[0].data();
        const lastId = parseInt(lastAuthor.id.replace("author", ""), 10);
        setNextAuthorId(`author${lastId + 1}`);
      } else {
        setNextAuthorId("author1");
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju ID-a autora:", error);
    }
  };


  const checkAuthorExists = async (authorName) => {
    const authorsRef = collection(firestore, "authors");
    const q = query(authorsRef, where("name", "==", authorName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };


  const addAuthor = async () => {
    try {
      const authorRef = doc(firestore, "authors", nextAuthorId);
      await setDoc(authorRef, {
        id: nextAuthorId,
        name: author,
        bio: "",
      });
    } catch (error) {
      console.error("Greška pri dodavanju autora:", error);
      throw error;
    }
  };

const uploadImage = async (imageUri, bookId) => {
  try {
    const fileName = `cover_images/${bookId}_${Date.now()}.jpg`;
    const response = await fetch(imageUri);
    const file = await response.blob();

    const { data, error } = await supabase.storage
      .from("book-images")
      .upload(fileName, file, {
        contentType: "image/jpeg",
      });

    if (error) throw error;

    return supabase.storage.from("book-images").getPublicUrl(data.path).data.publicUrl;
  } catch (error) {
    console.error("Greška pri uploadu slike:", error);
    throw error;
  }
};

  const handleAddBook = async () => {
    if (!title || !author || !pageCount || !genre) {
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Molimo popunite sva polja.",
      });
      return;
    }

    const authorExists = await checkAuthorExists(author);
    if (!authorExists) await addAuthor();

    try {
      let imageUrl = "";
      if (coverImageUrl) {
        imageUrl = await uploadImage(coverImageUrl, nextBookId);
      }

      const bookRef = doc(firestore, "books", nextBookId);
      await setDoc(bookRef, {
        id: nextBookId,
        title,
        author,
        pageCount,
        genre,
        coverImage: imageUrl,
        addedBy: user?.name || "Nepoznati korisnik",
        createdAt: new Date(),
      });

      Toast.show({
        type: "success",
        text1: "Uspjeh",
        text2: "Knjiga je uspješno dodana!",
      });

      setTitle("");
      setAuthor("");
      setPageCount("");
      setGenre("");
      setCoverImageUrl(null);
      fetchNextBookId();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Dodavanje knjige nije uspjelo.",
      });
    }
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Greška",
        text2: "Morate omogućiti pristup galeriji.",
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
      const { uri } = selectedImage;
      setCoverImageUrl(uri);
    }
  };

  useEffect(() => {
    fetchNextBookId();
    fetchNextAuthorId();
  }, []);

  return (
    <PageDesign showCentralCircle={false}>
      <View style={styles.viewstyle}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TextInput
            style={styles.input}
            placeholder="Unesite ime knjige"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Unesite ime pisca"
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={styles.input}
            placeholder="Unesite broj stranica"
            keyboardType="numeric"
            value={pageCount}
            onChangeText={setPageCount}
          />
          <TextInput
            style={styles.input}
            placeholder="Unesite žanr knjige"
            value={genre}
            onChangeText={setGenre}
          />
          <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
            <Text style={styles.buttonText}>Odaberite sliku</Text>
          </TouchableOpacity>
          {coverImageUrl && <Image source={{ uri: coverImageUrl }} style={styles.coverImage} />}
          <TouchableOpacity style={styles.button} onPress={handleAddBook}>
            <Text style={styles.buttonText}>Dodaj knjigu</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Toast />
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  viewstyle: {
    flex: 1,
    marginTop: "10%",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
  },
  input: {
    width: "90%",
    marginVertical: 10,
    height: 50,
    borderWidth: 1,
    borderColor: "#A889E6",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  imageButton: {
    marginTop: 20,
    width: "80%",
    height: 50,
    backgroundColor: "#6c4255",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    width: "80%",
    height: 50,
    backgroundColor: "#A889E6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  coverImage: {
    width: 150,
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
});

export default DodajKnjigu;