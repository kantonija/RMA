import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import PageDesign from "./ui/PageDesign";
import { app } from '../firebaseConfig';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from "../firebaseConfig";
import { Alert } from 'react-native';

const { width} = Dimensions.get("window");
const db = getFirestore(app);

export default function UrediProfil() {
  const [najdrazaKnjiga, setNajdrazaKnjiga] = useState("");
  const [najdraziPisac, setNajdraziPisac] = useState("");
  const [najdraziZanr, setNajdraziZanr] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data()); 
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
  };

  const handleRemovePhoto = () => {
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
      alert('Vaš profil je uspješno spremljen!');
      setShowProfile(false);
    } catch (error) {
      console.error('Greška pri spremanju profila: ', error);
      alert('Došlo je do greške pri spremanju vašeg profila.');
    }
  };
      
  return (
    <PageDesign>
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
            <Text style={{ marginTop: 80, marginBottom: 0 }}>Najdraža knjiga</Text>
           <TextInput
            style={[styles.input, {marginTop: -60}]}
            placeholder="Najdraža knjiga"
            value={najdrazaKnjiga}
            editable={true}
            onChangeText={(value) => {
              setNajdrazaKnjiga(value);
              setProfile({ ...profile, favBook: value });
            }}
          />
          <Text style={{ marginTop: 80, marginBottom: 0 }}>Najdraži pisac</Text>
          <TextInput
            style={[styles.input, {marginTop: -60}]}
            placeholder="Najdraži pisac"
            value={najdraziPisac}
            editable={true}
            onChangeText={(value) => {
              setNajdraziPisac(value);
              setProfile({ ...profile, favAuthor: value });
            }}
          />
          <Text style={{ marginTop: 80, marginBottom: 0 }}>Najdraži žanr</Text>
          <TextInput
            style={[styles.input, {marginTop: -60}]}
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
            <Text style={{ marginTop: 80, marginBottom: 0 }}>Najdraža knjiga</Text>
           <TextInput
            style={[styles.input, {marginTop: -60}]}
            placeholder="Najdraža knjiga"
            value={najdrazaKnjiga}
            editable={false}
          />
          <Text style={{ marginTop: 80, marginBottom: 0 }}>Najdraži pisac</Text>
          <TextInput
            style={[styles.input, {marginTop: -60}]}
            placeholder="Najdraži pisac"
            value={najdraziPisac}
            editable={false}
          />
           <Text style={{ marginTop: 80, marginBottom: 0 }}>Najdraži žanr</Text>
          <TextInput
            style={[styles.input, {marginTop: -60}]}
            placeholder="Najdraži žanr"
            value={najdraziZanr}
            editable={false}
          />
     
          </View>
        )}
  
        <br />
        <TouchableOpacity style={styles.button} onPress={showProfile ? handleSaveProfile : handleEditProfile}>
          <Text style={styles.buttonText}>{showProfile ? 'Spremi podatke' : 'Uredi podatke'}</Text>
        </TouchableOpacity>

      </View>
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6c4255",
    top: width > 600 ? -115 : 20,
    left: width > 600 ? -650 : -95,
  },
  avatar: {
    flex: 1,
    backgroundColor: '#fdc0c7',
    borderRadius: 1000,
    width: 100,
    height: 100,
    position: 'absolute',
    top: 10,
    right: -100,
  },
  avatarPlaceholder: {
    color: "#fff",
    fontWeight: "bold",
    top:30,
    right:-25
  },
  button: {
    backgroundColor: "#7b5e96",
    width:180,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    top: width > 600 ? -80 : 70,
    left:10
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign:'center'
  },
  input: {
    width: 200,
    height: 35,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    top: width > 600 ? -85 : 70
  },
  text: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    textAlign:'center',
    zIndex: 5
  }
});
