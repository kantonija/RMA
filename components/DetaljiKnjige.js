import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';
import { FaStar } from 'react-icons/fa';
import PageDesign from './ui/PageDesign';
import { useNavigation } from '@react-navigation/native';

const colors = {
  orange: "#F2C265",
  grey: "#a9a9a9"
};

export default function DetaljiKnjige({ route }) {
  const { bookId } = route.params;
  const [bookDetails, setBookDetails] = useState(null);
  const [authorId, setAuthorId] = useState(null); 
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookRef = doc(firestore, 'books', bookId);
        const bookSnap = await getDoc(bookRef);

        if (bookSnap.exists()) {
          const bookData = bookSnap.data();
          setBookDetails(bookData);

          const authorsRef = collection(firestore, 'books', bookId, 'author');
          const q = query(authorsRef, where('name', '==', bookData.author));
          const authorSnap = await getDocs(q);

          if (!authorSnap.empty) {
            const authorDoc = authorSnap.docs[0];
            setAuthorId(authorDoc.id);
          } else {
            console.warn('Autor nije pronađen u bazi.');
          }

          const userId = auth.currentUser.uid;
          const userBooksRef = collection(firestore, 'users', userId, 'userBooks');
          const bookDocRef = doc(userBooksRef, bookData.title);
          const bookDocSnap = await getDoc(bookDocRef);

          if (bookDocSnap.exists()) {
            const bookDocData = bookDocSnap.data();
            setReview(bookDocData.review);
            setRating(bookDocData.rating);
            setExistingReview(bookDocData);
          }
        } else {
          Alert.alert('Greška', 'Podaci o knjizi nisu pronađeni.');
        }
      } catch (error) {
        console.error('Greška pri dohvaćanju detalja o knjizi: ', error);
        Alert.alert('Greška', 'Došlo je do problema pri dohvaćanju podataka.');
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
    setLoading(false);
  }, [bookId]);



  const handleSaveReview = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userBooksRef = collection(firestore, 'users', userId, 'userBooks');
      const bookDocRef = doc(userBooksRef, bookDetails.title);
      await setDoc(bookDocRef, {
        review: review,
        rating: rating
      });
      Alert.alert('Uspjeh', 'Vaša recenzija je uspješno spremljena!');
    } catch (error) {
      console.error('Greška pri spremanju recenzije: ', error);
      Alert.alert('Greška', 'Došlo je do problema pri spremanju recenzije.');
    }
  };

  const handleMouseOverStar = value => setHoverValue(value);
  const handleMouseLeaveStar = () => setHoverValue(undefined);
  const handleClickStar = value => setRating(value);

  const handleAuthorClick = () => {
    if (authorId && bookDetails.author) {
      navigation.navigate('UrediAutora', { 
        authorId,
        authorName: bookDetails.author 
      });
    } else {
      Alert.alert('Greška', 'Podaci o autoru nisu dostupni.');
    }
  };

  const handleDeleteBook = async () => {
    try {
      const bookRef = doc(firestore, 'books', bookId);
      await deleteDoc(bookRef);
      Alert.alert('Uspjeh', 'Knjiga je uspješno obrisana.');
      navigation.goBack(); 
    } catch (error) {
      console.error('Greška pri brisanju knjige: ', error);
      Alert.alert('Greška', 'Došlo je do problema pri brisanju knjige.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#986BFC" />;
  }

  if (!bookDetails) {
    return (
      <PageDesign>
        <Text style={styles.errorText}>Podaci o knjizi nisu dostupni ili nedostaju.</Text>
      </PageDesign>
    );
  }

  return (
    <PageDesign showCentralCircle={false}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={bookDetails.coverImage ? { uri: bookDetails.coverImage } : <Ionicons name="image-outline" size={50} color="black" />}
            style={styles.image}
          />
          <Text style={styles.title}>{bookDetails.title}</Text>
          <Text style={styles.info}>{bookDetails.genre}</Text>
          <Text style={styles.info}>Broj stranica: {bookDetails.pageCount}</Text>

          {existingReview ? (
            <View>
              <Text style={styles.info}>Vaša recenzija:</Text>
              <Text style={styles.review}>{existingReview.review}</Text>
              <View style={styles.starsContainer}>
                {Array(5).fill(0).map((_, index) => (
                  <FaStar
                    key={index}
                    size={24}
                    color={(existingReview.rating) > index ? colors.orange : colors.grey}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.commentInput}
                placeholder="Napiši recenziju..."
                multiline
                value={review}
                onChangeText={(text) => setReview(text)}
              />

              <View style={styles.starsContainer}>
                {Array(5).fill(0).map((_, index) => (
                  <FaStar
                    key={index}
                    size={24}
                    color={(hoverValue || rating) > index ? colors.orange : colors.grey}
                    onClick={() => handleClickStar(index + 1)}
                    onMouseOver={() => handleMouseOverStar(index + 1)}
                    onMouseLeave={handleMouseLeaveStar}
                  />
                ))}
              </View>
            </View>
          )}


          
          {existingReview ? null : (
            <TouchableOpacity style={styles.editButton} onPress={handleSaveReview}>
              <Text style={styles.editButtonText}>Spremi recenziju</Text>
            </TouchableOpacity>
          )}
          

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('UrediKnjigu', { bookId })}>
            <Text style={styles.editButtonText}>Uredi podatke o knjizi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: '#63042F' }]} onPress={handleDeleteBook}>
            <Text style={styles.editButtonText}>Obriši knjigu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageDesign>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom:90,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  commentInput: {
    width: '90%',
    height: 80,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#A889E6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
});

