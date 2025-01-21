import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { collection, setDoc, doc, getDocs, query, orderBy, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import PageDesign from "./ui/PageDesign";
import { AuthContext } from "../AuthContext";
import Toast from "react-native-toast-message";
import * as ImagePicker from "react-native-image-picker";
import { supabase } from '../supabaseClient';

const DodajKnjigu = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [genre, setGenre] = useState("");
  const [nextBookId, setNextBookId] = useState("");
  const [nextAuthorId, setNextAuthorId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
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
      console.error("Greška pri dohvaćanju ID-a:", error);
      setNextBookId("book1");
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
      setNextAuthorId("author1");
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
      Toast.show({
        type: "success",
        text1: "Uspjeh",
        text2: "Autor je uspješno dodan!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Dodavanje autora nije uspjelo. Pokušajte ponovo.",
      });
      console.error("Greška pri dodavanju autora:", error);
    }
  };

  const uploadImage = async (imageUri, bookId) => {
    const fileName = `${bookId}.jpg`;
    const response = await fetch(imageUri);
    const file = await response.blob();

    const { data, error } = await supabase.storage
      .from("book-images")
      .upload(fileName, file, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.error("Greška pri uploadu slike:", error);
      throw error;
    }

    return `${supabase.storage.from("book-images").getPublicUrl(fileName).data.publicUrl}`;
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

    if (!authorExists) {
      await addAuthor();
    }

    try {
      let imageUrl = "";
      if (selectedImageUri) {
        imageUrl = await uploadImage(selectedImageUri, nextBookId);
      }

      const bookRef = doc(firestore, "books", nextBookId);
      await setDoc(bookRef, {
        id: nextBookId,
        title,
        author,
        pageCount,
        genre,
        coverImage: imageUrl,
        addedBy: user ? user.name : "Nepoznati korisnik",
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
      setSelectedImageUri(null);
      fetchNextBookId();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Greška",
        text2: "Dodavanje knjige nije uspjelo. Pokušajte ponovo.",
      });
      console.error("Greška pri dodavanju knjige:", error);
    }
  };

  const handlePickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: "photo", quality: 0.8 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setSelectedImageUri(uri);
          setCoverImageUrl(uri);
        }
      }
    );
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
            onChangeText={(text) => setTitle(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Unesite ime pisca"
            value={author}
            onChangeText={(text) => setAuthor(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Unesite broj stranica"
            value={pageCount}
            keyboardType="numeric"
            onChangeText={(text) => setPageCount(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Unesite žanr knjige"
            value={genre}
            onChangeText={(text) => setGenre(text)}
          />
          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Odaberite sliku</Text>
          </TouchableOpacity>
          {coverImageUrl && (
            <Image source={{ uri: coverImageUrl }} style={styles.coverImage} />
          )}
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

export default DodajKnjigu;
