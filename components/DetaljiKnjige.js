import React from 'react';
import { View, Text, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import PageDesign2 from './ui/PageDesign2';
import { TouchableOpacity } from 'react-native';

const DetaljiKnjige = ({ route, navigation }) => {
  const { book } = route.params;

  const renderImage = book.image ? (
    <Image source={{ uri: book.image }} style={styles.image} />
  ) : (
    <ActivityIndicator size="large" color="#986BFC" style={styles.image} />
  );

  return (
    <PageDesign2>
      <View style={styles.container}>

        <Text style={styles.title}>{book.title || 'Naslov knjige'}</Text>

        <Text style={styles.author}>{book.author || 'Autor: Nepoznat'}</Text>

        {renderImage}

        <Text style={styles.description}>{book.description || 'Opis knjige nije dostupan.'}</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Vrati se na listu knjiga</Text>
        </TouchableOpacity>
      </View>
    </PageDesign2>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#63042F',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: '#C56590',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0', 
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  button: {
    width: 200, 
    maxWidth: 300, 
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#986BFC",
    backgroundColor: "#986BFC",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
});

export default DetaljiKnjige;
