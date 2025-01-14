import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from "react-native";
import PageDesign from "./ui/PageDesign";
import { app } from '../firebaseConfig';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth } from "../firebaseConfig";
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

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
        Alert.alert("Greška", "Došlo je do greške pri učitavanju vašeg profila.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSetPhoto = () => {
    // Postavljanje profilne fotografije (nije implementirano)
  };

  const handleRemovePhoto = () => {
    // Uklanjanje profilne fotografije (nije implementirano)
  };

  const handleEditProfile = () => {
    setShowProfile(!showProfile);
    setIsEditable(!isEditable);
  };

  const handleSaveProfile = async () => {
    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, 'users', userId), {
        ...profile,
        favBook: najdrazaKnjiga,
        favAuthor: najdraziPisac,
        favGenre: najdraziZanr,
      });
      Alert.alert('Uspjeh', 'Vaš profil je uspješno spremljen!');
      setShowProfile(false);
    } catch (error) {
      console.error('Greška pri spremanju profila: ', error);
      Alert.alert('Greška', 'Došlo je do greške pri spremanju vašeg profila.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert("Greška", "Došlo je do greške pri odjavi.");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      Alert.alert('Uspjeh', 'Vaš profil je uspješno obrisan.');

      // Odjava korisnika koristeći postojeću funkciju handleLogout
      handleLogout();
    } catch (error) {
      console.error('Greška pri brisanju profila: ', error);
      Alert.alert('Greška', 'Došlo je do greške pri brisanju vašeg profila.');
    }
  };

  return (
    <PageDesign showCentralCircle={false}>
      <View>
        <Text style={styles.title}>Vaši podaci:</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarPlaceholder}>avatar</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSetPhoto}>
          <Text style={styles.buttonText}>Postavi profilnu fotografiju</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleRemovePhoto}>
          <Text style={styles.buttonText}>Ukloni fotografiju</Text>
        </TouchableOpacity>

        {showProfile ? (
          <View>
            <Text>Najdraža knjiga</Text>
            <TextInput
              style={styles.input}
              placeholder="Najdraža knjiga"
              value={najdrazaKnjiga}
              editable={true}
              onChangeText={(value) => {
                setNajdrazaKnjiga(value);
                setProfile({ ...profile, favBook: value });
              }}
            />
            <Text>Najdraži pisac</Text>
            <TextInput
              style={styles.input}
              placeholder="Najdraži pisac"
              value={najdraziPisac}
              editable={true}
              onChangeText={(value) => {
                setNajdraziPisac(value);
                setProfile({ ...profile, favAuthor: value });
              }}
            />
            <Text>Najdraži žanr</Text>
            <TextInput
              style={styles.input}
              placeholder="Najdraži žanr"
              value={najdraziZanr}
              editable={true}
              onChangeText={(value) => {
                setNajdraziZanr(value);
                setProfile({ ...profile, favGenre: value });
              }}
            />
          </View>
        ) : (
          <View>
            <Text>Najdraža knjiga: {najdrazaKnjiga}</Text>
            <Text>Najdraži pisac: {najdraziPisac}</Text>
            <Text>Najdraži žanr: {najdraziZanr}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={showProfile ? handleSaveProfile : handleEditProfile}>
          <Text style={styles.buttonText}>{showProfile ? 'Spremi podatke' : 'Uredi podatke'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#63042F', marginTop: 10 }]} onPress={handleDeleteProfile}>
          <Text style={styles.buttonText}>Obriši profil</Text>
        </TouchableOpacity>
      </View>
    </PageDesign>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#fdc0c7',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#7b5e96",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
});
