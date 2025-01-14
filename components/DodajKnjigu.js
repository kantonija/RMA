import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { collection, setDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { firestore } from "../firebaseConfig"; 
import PageDesign from "./ui/PageDesign";
import { AuthContext } from "../AuthContext";

const DodajKnjigu = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [genre, setGenre] = useState("");
  const [nextBookId, setNextBookId] = useState("");
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

  
  useEffect(() => {
    fetchNextBookId();
  }, []);

  const handleAddBook = async () => {
    if (!title || !author || !pageCount || !genre) {
      Alert.alert("Greška", "Molimo popunite sva polja.");
      return;
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

      Alert.alert("Uspjeh", "Knjiga je uspješno dodana!");
      setTitle("");
      setAuthor("");
      setPageCount("");
      setGenre("");
      fetchNextBookId();
    } catch (error) {
      Alert.alert("Greška", "Dodavanje knjige nije uspjelo. Pokušajte ponovo.");
      console.error("Greška pri dodavanju knjige:", error);
    }
  };

  return (
    <PageDesign>
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
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "70%",
    marginTop: 15,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  button: {
    marginTop: 20,
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
