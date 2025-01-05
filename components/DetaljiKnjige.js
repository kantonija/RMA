import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import PageDesign from './ui/PageDesign';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function DetaljiKnjige({route})
{
  const navigation = useNavigation();
  const { book } = route.params;
  const renderImage = book.image ? (
    <Image source={{ uri: book.image }} style={styles.image} />
  ) : (
    <ActivityIndicator size="large" color="#986BFC" style={styles.image} />
  );
  return (
    <PageDesign showCentralCircle={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Vlak u snijegu</Text>
        <Text style={styles.author}>Mato Lovrak</Text>

        <Text style={styles.info}>Žanr: pustolovni</Text>
        <Text style={styles.info}>Broj stranica: 150</Text>

        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={50} color="black" />
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Napiši komentar..."
          multiline
        />

        <View style={styles.starsContainer}>
          {Array(5).fill(0).map((_, index) => (
            <Ionicons key={index} name="star-outline" size={30} color="black" />
          ))}
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText} onPress={() => navigation.navigate("UrediKnjigu")}>Uredi podatke o knjizi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText} onPress={() => navigation.navigate("Autor")}>O autoru</Text>
        </TouchableOpacity>
      </View>
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D5D5D',
    marginTop: 20,
  },
  author: {
    fontSize: 18,
    color: '#5D5D5D',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#5D5D5D',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  commentInput: {
    width: '90%',
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#A889E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D3D3D3',
    paddingVertical: 10,
  },
});
