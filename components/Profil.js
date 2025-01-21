import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import PageDesign from './ui/PageDesign';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs, orderBy, query, limit, where, Timestamp, setDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get("window");

export default function Profil() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [lastBook, setLastBook] = useState(null);
  const [activityTime, setActivityTime] = useState(0);
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
          console.log("No books found.");
        }
      } catch (error) {
        console.error('Error fetching last added book:', error);
      }
    };

    const fetchActivityTime = async () => {
      try {
        if (!user) return;

        const currentDate = new Date();
        const lastWeekDate = new Date(currentDate);
        lastWeekDate.setDate(currentDate.getDate() - 7);

        const activitiesRef = collection(firestore, 'activities');
        const q = query(
          activitiesRef,
          where('userId', '==', user.uid),
          where('startTime', '>=', Timestamp.fromDate(lastWeekDate)),
          orderBy('startTime')
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('Nema aktivnosti u posljednjih 7 dana.');
          setActivityTime(0);
          return;
        }

        let totalTimeInMinutes = 0;
        querySnapshot.forEach(doc => {
          const activity = doc.data();
          if (activity.startTime && activity.endTime) {
            const startTime = activity.startTime.toDate();
            const endTime = activity.endTime.toDate();
            const duration = (endTime - startTime) / (1000 * 60);
            totalTimeInMinutes += duration;
          } else {
            console.log('Nema startTime ili endTime za aktivnost:', doc.id);
          }
        });

        setActivityTime(Math.round(totalTimeInMinutes));
      } catch (error) {
        console.error('Error fetching activity time:', error);
      }
    };

    fetchProfile();
    fetchLastBook();
    fetchActivityTime();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigation.navigate('Login');
      Toast.show({
        type: 'success',
        text1: 'Odjava uspešna',
        text2: 'Uspešno ste se odjavili.',
      });
    } catch (error) {
      console.error('Logout error:', error);
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
          <Text style={styles.lastBook}>Vaša zadnje dodana knjiga</Text>
          {lastBook ? (
            <View style={styles.bookCard}>
              <Image
                source={{ uri: lastBook.imageUrl || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
                style={styles.bookImagePlaceholder}
              />
              <Text style={styles.bookName}>{lastBook.title}</Text>
              <Text style={styles.bookAuthor}>Autor: {lastBook.author}</Text>
            </View>
          ) : (
            <Text style={styles.noBookText}>Nema zadnje dodane knjige.</Text>
          )}
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
    top: width > 600 ? 15 : 10,
    left: width > 600 ? -760 : -190,
  },
  greetingText: {
    fontSize: 26,
    color: '#6b4c54',
    marginBottom: 10,
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
    top: 135,
  },
  lastBook: {
    fontSize: 20,
    color: '#6b4c54',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookCard: {
    width: 200,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
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
    width: 50,
    height: 50,
    backgroundColor: '#d6bcfa',
    borderRadius: 5,
    marginBottom: 10,
  },
  bookName: {
    fontSize: 20,
    color: '#6b4c54',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#6b4c54',
  },
  noBookText: {
    fontSize: 18,
    color: '#6b4c54',
    fontStyle: 'italic',
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
