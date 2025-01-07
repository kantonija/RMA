import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PageDesign from './ui/PageDesign';

const ListaKnjiga = () => {
  const navigation = useNavigation();

  const books = [
    { id: 1, title: 'Naslov Knjige 1', author: 'Autor 1', description: 'Opis knjige 1' },
    { id: 2, title: 'Naslov Knjige 2', author: 'Autor 2', description: 'Opis knjige 2' },
  ];

  const handleBookPress = (book) => {
    navigation.navigate('DetaljiKnjige', { book });
  };

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
      {books.map((book) => (
        <TouchableOpacity
          key={book.id}
          style={styles.bookItem}
          onPress={() => handleBookPress(book)}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.bookImage}
          />
          <View>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>Autor: {book.author}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
