import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { collection, setDoc, doc, getDocs, query, orderBy, where } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; 
import PageDesign from "./ui/PageDesign";
import { AuthContext } from "../AuthContext";
import Toast from "react-native-toast-message";

const DodajKnjigu = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [genre, setGenre] = useState("");
  const [nextBookId, setNextBookId] = useState("");
  const [nextAuthorId, setNextAuthorId] = useState(""); 
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
      const bookRef = doc(firestore, "books", nextBookId); 

      await setDoc(bookRef, {
        id: nextBookId,
        title,
        author,
        pageCount,
        genre,
        coverImage: "", 
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

  useEffect(() => {
    fetchNextBookId();
    fetchNextAuthorId();
  }, []);

  return (
    <PageDesign>
      <View style={styles.viewstyle}>
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
        <TouchableOpacity style={styles.button} onPress={handleAddBook}>
          <Text style={styles.buttonText}>Dodaj knjigu</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  viewstyle: {
    marginTop: 70,
    width: '85%',
    alignContent: 'center',
    alignItems: 'center',
  },

  input: {
    width: "85%",
    marginTop: 20,
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  button: {
    marginTop: 70,
    width: "40%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "#6c4255",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DodajKnjigu;
