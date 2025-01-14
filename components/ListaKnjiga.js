import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PageDesign from './ui/PageDesign';
import { app } from '../firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(app);

const ListaKnjiga = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksRef = collection(db, 'books');
      const querySnapshot = await getDocs(booksRef);
      const booksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks(); // Osvežava podatke svaki put kada se ekran fokusira
    }, [])
  );

  const handleBookPress = (book) => {
    navigation.navigate('DetaljiKnjige', { bookId: book.id });
  };

  if (loading) {
    return (
      <PageDesign>
        <ActivityIndicator size="large" color="#63042F" />
      </PageDesign>
    );
  }

  return (
    <PageDesign>
      <View style={styles.container}>
        <Text style={styles.heading}>Lista Knjiga</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Pretraži knjige..."
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Traži</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.bookList}>
          {books.sort((a, b) => a.title.localeCompare(b.title)).map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.bookItem}
              onPress={() => handleBookPress(book)}
            >
              <Image
                source={{ uri: book.coverImage || 'https://via.placeholder.com/150' }}
                style={styles.bookImage}
              />
              <View>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>Autor: {book.author}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#63042F',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D082A5',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#D082A5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bookList: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 20,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#63042F',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#C56590',
  },
});

export default ListaKnjiga;
