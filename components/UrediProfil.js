import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import PageDesign from "./ui/PageDesign";
import { app } from '../firebaseConfig';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth } from "../firebaseConfig";
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get("window");
const db = getFirestore(app);

export default function UrediProfil() {
  const { user, logout } = useContext(AuthContext);
  const [najdrazaKnjiga, setNajdrazaKnjiga] = useState("");
  const [najdraziPisac, setNajdraziPisac] = useState("");
  const [najdraziZanr, setNajdraziZanr] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile({ ...docSnap.data() });
          setNajdrazaKnjiga(docSnap.data().favBook || '');
          setNajdraziPisac(docSnap.data().favAuthor || '');
          setNajdraziZanr(docSnap.data().favGenre || '');
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        Toast.show({
          type: 'error',
          text1: 'Greška',
          text2: 'Došlo je do greške pri učitavanju vašeg profila.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, 'users', userId), {
        ...profile,
        favBook: najdrazaKnjiga,
        favAuthor: najdraziPisac,
        favGenre: najdraziZanr,
      });
      Toast.show({
        type: 'success',
        text1: 'Uspjeh',
        text2: 'Vaš profil je uspješno spremljen!',
      });
      setShowProfile(false);
    } catch (error) {
      console.error('Greška pri spremanju profila: ', error);
      Toast.show({
        type: 'error',
        text1: 'Greška',
        text2: 'Došlo je do greške pri spremanju vašeg profila.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Greška',
        text2: 'Došlo je do greške pri odjavi.',
      });
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      Toast.show({
        type: 'success',
        text1: 'Uspjeh',
        text2: 'Vaš profil je uspješno obrisan.',
      });

      handleLogout();
    } catch (error) {
      console.error('Greška pri brisanju profila: ', error);
      Toast.show({
        type: 'error',
        text1: 'Greška',
        text2: 'Došlo je do greške pri brisanju vašeg profila.',
      });
    }
  };

  return (
    <PageDesign showCentralCircle={false}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.viewstyle}>
          <Text style={styles.title}>Vaši podaci:</Text>

          <View style={styles.avatar}>
            <Text style={styles.avatarPlaceholder}>avatar</Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Postavi profilnu fotografiju</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { marginTop: 10 }]}>
            <Text style={styles.buttonText}>Ukloni fotografiju</Text>
          </TouchableOpacity>

          {showProfile ? (
            <View>
              <Text style={styles.label}>Najdraža knjiga</Text>
              <TextInput
                style={styles.input}
                placeholder="Najdraža knjiga"
                value={najdrazaKnjiga}
                onChangeText={(value) => setNajdrazaKnjiga(value)}
              />
              <Text style={styles.label}>Najdraži pisac</Text>
              <TextInput
                style={styles.input}
                placeholder="Najdraži pisac"
                value={najdraziPisac}
                onChangeText={(value) => setNajdraziPisac(value)}
              />
              <Text style={styles.label}>Najdraži žanr</Text>
              <TextInput
                style={styles.input}
                placeholder="Najdraži žanr"
                value={najdraziZanr}
                onChangeText={(value) => setNajdraziZanr(value)}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.favourites}><b> Najdraža knjiga: </b> {najdrazaKnjiga}</Text>
              <Text style={styles.favourites}><b> Najdraži pisac: </b> {najdraziPisac}</Text>
              <Text style={styles.favourites}><b> Najdraži žanr: </b> {najdraziZanr}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={showProfile ? handleSaveProfile : () => setShowProfile(true)}>
            <Text style={styles.buttonText}>{showProfile ? 'Spremi podatke' : 'Uredi podatke'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#63042F', marginTop: 10 }]} onPress={handleDeleteProfile}>
            <Text style={styles.buttonText}>Obriši profil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  viewstyle: {
    flex: 1,
    alignItems: 'center',
    width: '90%',
    marginLeft: '5%',
    alignContent: 'center',
    marginTop:20, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#63042F'
  },
  avatar: {
    backgroundColor: '#fdc0c7',
    borderRadius: 100,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: '#A889E6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width:'70%',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '450'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#63042F',
  },
  input: {
    width: width * 0.9,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#A889E6',
    padding: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  favourites: {
    color:'#63042F',
    fontSize: 18,
    marginBottom:7,
    fontWeight: '500'
  },
}); 
