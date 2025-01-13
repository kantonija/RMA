import React,{useState} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import PageDesign from './ui/PageDesign';
import { Ionicons } from '@expo/vector-icons';

export default function UrediKnjigu() {
    const [naslovKnjige, setNaslovKnjige] = useState("");
    const [autorKnjige, setAutorKnjige] = useState("");
    const [zanrKnjige, setZanrKnjige] = useState("");
  
    const handleSetPhoto = () => {
    };
  
    const handleRemovePhoto = () => {
    };
    

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

        <TouchableOpacity style={styles.button} onPress={handleSetPhoto}>
        <Text style={styles.buttonText}>Promijeni sliku</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleRemovePhoto}>
        <Text style={styles.buttonText}>Ukloni sliku</Text>
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
  button: {
    backgroundColor: '#A889E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
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