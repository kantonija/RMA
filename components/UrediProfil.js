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
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabaseClient';
import { Alert } from "react-native";
import { Image } from 'react-native';

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
          setProfile({
            ...docSnap.data(),
            profileImage: docSnap.data().profileImage || '',
          });
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
        profileImage: profile.profileImage,
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
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        ...profile,
        profileImage: profile.profileImage,
      }, { merge: true });
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

  const deleteProfilePicture = async () => {
    try {
      const userId = auth.currentUser.uid;
      const fileName = `${userId}-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("usersProfilePictures")
        .remove([fileName]);
      if (error) {
        console.error("Error deleting profile picture:", error);
        Toast.show({
          type: 'error',
          text1: 'Greška',
          text2: 'Došlo je do greške pri brisanju profila.',
        });
      } else {
        setProfile((prev) => ({ ...prev, profileImage: '' }));
        Toast.show({
          type: 'success',
          text1: 'Uspjeh',
          text2: 'Vaš profilna fotografija je uspješno obrisana!',
        });
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      Toast.show({
        type: 'error',
        text1: 'Greška',
        text2: 'Došlo je do greške pri brisanju profila.',
      });
    }
  };

  const setProfilePicture = async () => {
    const userId = auth.currentUser.uid;
    console.log(userId);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled) {
        const {uri} = result.assets[0];
        const fileName = `${userId}-${Date.now()}.jpg`;
  
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
  
          const {data, error} = await supabase.storage
                          .from("usersProfilePictures")
                          .upload(fileName, blob);
  
          
  
          if (error) {
            Alert.alert("Greška", "Datoteka nije učitana!");
            return;
          }
          const {data: publicUrlData } = supabase.storage
                          .from("usersProfilePictures")
                          .getPublicUrl(fileName);
  
          const publicUrl = publicUrlData.publicUrl;
  
          setProfile((prev) => ({...prev, profileImage: publicUrl}));
          console.log('Profile image updated:', profile.profileImage);
  
        } catch (uploadError) {
  
        }
      }
    }
 if (loading) {
 return (
 <View style = {styles.container} >
 <Text style = {styles.text} > Učitavanje profila ...</Text>
 </View>
 );
}
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
  {profile.profileImage ? (
    <Image
      source={{ uri: profile.profileImage }}
      style={{ width: 120, height: 120, borderRadius: 100 }}
    />
  ) : (
    <Text style={styles.avatarPlaceholder}>avatar</Text>
  )}
</View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={setProfilePicture}>Postavi profilnu fotografiju</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={handleSaveProfile}>Spremi fotografiju</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { marginTop: 10 }]}>
            <Text style={styles.buttonText} onPress={deleteProfilePicture}>Ukloni fotografiju</Text>
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
    width: '90%',
    height: '10%',
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
