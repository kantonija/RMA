import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, AppState } from 'react-native';
import PageDesign from './ui/PageDesign';
import { signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs, orderBy, query, limit, where, Timestamp, addDoc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get("window");

let userActivityIntervalId = null;  
let sessionStartTime = null;  

const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
      sessionStartTime = new Date();

      userActivityIntervalId = setInterval(() => {
        console.log("⏳ Aktivnost traje...");
      }, 60000);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

const logUserActivity = async (user) => {
  if (!sessionStartTime || !user) return;

  const sessionEndTime = new Date();
  const duration = Math.round((sessionEndTime - sessionStartTime) / 60000);

  try {
    const userActivityRef = collection(firestore, `users/${user.uid}/userActivity`);
    await addDoc(userActivityRef, {
      loginTime: Timestamp.fromDate(sessionStartTime),
      logoutTime: Timestamp.fromDate(sessionEndTime),
      duration: duration
    });

    console.log(`Aktivnost spremljena: ${duration} min`);
  } catch (error) {
    console.error("Greška pri spremanju aktivnosti:", error);
  }

  sessionStartTime = null;
};

export default function Profil() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [lastBook, setLastBook] = useState(null);
  const [name, setName] = useState("");
  const [activityTime, setActivityTime] = useState(0);

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
        Toast.show({
          type: 'error',
          text1: 'Greška',
          text2: 'Došlo je do greške pri učitavanju vašeg profila.',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchLastBook = async () => {
      try {
        const booksRef = collection(firestore, 'books');
        const q = query(booksRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
          const lastBookData = querySnapshot.docs[0].data();
          setLastBook(lastBookData);
        } else {
          console.log("Nema knjiga.");
          setLastBook(null);
        }
      } catch (error) {
        console.error('Pogreška pri dohvaćanju zadnje knjige:', error);
        setLastBook(null);
      }
    };
    const fetchActivityTime = async () => {
      try {
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);

        const activitiesRef = collection(firestore, `users/${user.uid}/userActivity`);
        const q = query(activitiesRef, where('loginTime', '>=', Timestamp.fromDate(lastWeekDate)));
        const querySnapshot = await getDocs(q);

        let totalTime = 0;
        querySnapshot.forEach(doc => {
          totalTime += doc.data().duration || 0;
        });

        setActivityTime(totalTime);
      } catch (error) {
        console.error("Error fetching activity time:", error);
      }
    };

    fetchProfile();
    fetchActivityTime();
    fetchLastBook();


    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        console.log("Korisnik se vratio u aplikaciju");
        sessionStartTime = new Date();

        if (!userActivityIntervalId) {
          userActivityIntervalId = setInterval(() => {
            console.log("⏳ Aktivnost traje...");
          }, 60000);
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("Korisnik napustio aplikaciju");
        await logUserActivity(user);

        if (userActivityIntervalId) {
          clearInterval(userActivityIntervalId);
          userActivityIntervalId = null;
        }
      }
    };

    AppState.addEventListener("change", handleAppStateChange);

    return () => {
      if (userActivityIntervalId) clearInterval(userActivityIntervalId);
    };
  
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (userActivityIntervalId) {
        clearInterval(userActivityIntervalId);
      }
      logout();
      navigation.navigate('Login');
      Toast.show({
        type: 'success',
        text1: 'Odjava uspešna',
        text2: 'Uspešno ste se odjavili.',
      });
      
      console.log("Korisnik odjavljen");
    } catch (error) {
      console.error("Error logging out:", error);
      Toast.show({
        type: 'error',
        text1: 'Greška',
        text2: 'Došlo je do greške pri odjavi.',
      });
    }
  };
  
  
  return (
    <PageDesign>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>Pozdrav, {name}</Text>
          <Text style={styles.infoText}>U proteklom tjednu bili ste aktivni {activityTime} minuta!</Text>
        </View>
        <View style={styles.bookContainer}>
          {lastBook ? (
            <View style={styles.bookCard}>
              <Image
                source={{ uri: lastBook.coverImage || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
                style={styles.bookImagePlaceholder}
              />
              <Text style={styles.bookName}>Posljednje dodano:<br/><u>{lastBook.title}</u></Text>
            </View>
          ) : (
            <Text style={styles.noBookText}>Nema zadnje dodane knjige.</Text>
          )}
        </View>
        
        <TouchableOpacity style={[styles.circleButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Odjavi se</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.circleButton, styles.editProfileButton]} onPress={() => navigation.navigate('UrediProfil')}>
          <Text style={styles.buttonText}>Uredi profil</Text>
        </TouchableOpacity>
      </View>
      <Toast />
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
    top: width > 600 ? 15 : 7,
    left: width > 600 ? -760 : -170,
  },
  greetingText: {
    fontSize: 26,
    color: '#6b4c54',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 18,
    color: '#6b4c54',
  },
  bookContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 130,
    width: '90%',
  },
  bookCard: {
    width: width * 0.5, 
    height: width * 0.55,
    backgroundColor: '#d6bcfa',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  bookImagePlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',    
    borderRadius: 5,
    marginBottom: 4,
  },
  bookName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b4c54',
    marginBottom: 10,
    textAlign: 'center',
  },
  noBookText: {
    fontSize: 18,
    color: '#6b4c54',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  circleButton: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  logoutButton: {
    backgroundColor: '#d6bcfa',
    color: '#63042F',
    width: 100,
    height: 100,
    top: 450,
    left: -165,
  },
  editProfileButton: {
    backgroundColor: '#fdc0c7',
    width: 150,
    height: 150,
    top: 370,
    right: -165,
  },
  buttonText: {
    fontSize: 18,
    color: '#63042F',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});