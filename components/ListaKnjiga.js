import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PageDesign from './ui/PageDesign';
import { app } from '../firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { supabase } from '../supabaseClient'

const db = getFirestore(app);

const ListaKnjiga = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksRef = collection(db, 'books');
      const querySnapshot = await getDocs(booksRef);
      const booksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setBooks(booksData);
      setFilteredBooks(booksData); 
      } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false);
    }
  };

  
  const filterBooks = (text) => {
    const lowercasedText = text.toLowerCase();
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(lowercasedText) ||
      book.author.toLowerCase().includes(lowercasedText)
    );
    setFilteredBooks(filtered);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    filterBooks(text);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks(); 
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
            placeholder="Pretraži po naslovu ili autoru..."
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
        </View>

        <ScrollView contentContainerStyle={styles.bookList}>
          {filteredBooks.sort((a, b) => a.title.localeCompare(b.title)).map((book) => (
           <TouchableOpacity
            key={book.id}
            style={styles.bookItem}
            onPress={() => handleBookPress(book)}
            >
              <Image
                source={{ uri: book.coverImage || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#63042F',
  },
  bookAuthor: {
    fontSize: 18,
    color: '#C56590',
  },
});

export default ListaKnjiga;
