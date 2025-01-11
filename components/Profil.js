import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import PageDesign from './ui/PageDesign';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

const { width} = Dimensions.get("window");

export default function Profil()
{
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        console.log("Korisnik nije prijavljen.");
        setLoading(false);
        return;
      }
  
      try {
        const userId = user.uid;
        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name); 
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        Alert.alert("Greška", "Došlo je do greške pri učitavanju vašeg profila.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [user]);

 
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        logout();
      })
      .catch((error) => {
        console.error('Odjava nije uspjela: ', error.message);
      });
  };

  return (
    <PageDesign>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}> Pozdrav, {name} </Text>
          <Text style={styles.infoText}>U proteklom tjednu bili ste aktivni{"\n"}? minuta!</Text>
        </View>

        <View style={styles.bookContainer}>
          <Text style={styles.lastBook}>Vaša zadnje dodana knjiga</Text>
            <View style={styles.bookCard}>
              <View style={styles.bookImagePlaceholder} />
              <Text style={styles.bookName}>naslov</Text>
              <Text style={styles.bookAuthor}>autor</Text>
            </View>
        </View>


        <TouchableOpacity
          style={[styles.circleButton, styles.logoutButton]}
          onPress={handleLogout}>
          <Text style={styles.buttonText}>Odjavi se</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.circleButton, styles.editProfileButton]}
          onPress={() => navigation.navigate('UrediProfil')}>
          <Text style={styles.buttonText}>Uredi profil</Text>
        </TouchableOpacity>
      </View>
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: width > 600 ? 15 : 10,
    left: width > 600 ? -760 : -200,
  },
  greetingText: {
    fontSize: 24,
    color: '#6b4c54',
    marginBottom: 10,
    fontWeight:'bold'
  },
  infoText: {
    fontSize: 16,
    color: '#6b4c54',
  },
  bookContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 150,
  },
  lastBook: {
    fontSize: 16,
    color: '#6b4c54',
    marginBottom: 10,
    fontWeight:'bold'
  },
  bookCard: {
    width: 200,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  bookImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#d6bcfa',
    borderRadius: 5,
    marginBottom: 10,
  },
  bookName: {
    fontSize: 16,
    color: '#6b4c54',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b4c54',
  },
  circleButton: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  logoutButton: {
    backgroundColor: '#d6bcfa',
    width: 100,
    height: 100,
    top: 450,
    left: -170,
  },
  editProfileButton: {
    backgroundColor: '#fdc0c7',
    width: 150,
    height: 150,
    top: 370,
    right: -175,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight:'bold'
  },
});

