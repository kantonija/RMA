import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import PageDesign from './ui/PageDesign';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { app } from '../firebaseConfig';
import { FaStar } from 'react-icons/fa';

const db = getFirestore(app);

export default function DetaljiKnjige({route})
{
  const navigation = useNavigation();
  const[review, setReview] = useState('')
  const [profile, setProfile] = useState({ userBooks: { "Vlak u snijegu": {} } });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined)
  const { book } = route.params;
  const [isReviewExisting, setIsReviewExisting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = auth.currentUser.uid;
        const bookTitle = book.title;
        const docRef = doc(db, 'users', userId, 'userBooks', bookTitle);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
          const existingReview = docSnap.data().review;
          const existingRating = docSnap.data().rating;
          if (existingReview && existingRating) {
            setReview(existingReview);
            setRating(existingRating);
            setIsReviewExisting(true);
          } else {
            setIsReviewExisting(false);
          }
        } else {
          console.log("No such document!");
          setIsReviewExisting(false);
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

  const handleSaveReview = async () => {
    try {
      const userId = auth.currentUser.uid;
      const bookTitle = book.title; // Get the book title from the book object
      const userBooksRef = doc(db, 'users', userId, 'userBooks', bookTitle);
      await setDoc(userBooksRef, {
        review: review,
        rating: rating,
      });
      alert('Vaša recenzija je uspješno spremljena!');
    } catch (error) {
      console.error('Greška pri spremanju profila: ', error);
      alert('Došlo je do greške pri spremanju vašeg profila.');
    }
  };

  const handlePress = (index) => {
    setRating(index + 1);
    const newStars = stars.map((star, i) => i <= index);
    setStars(newStars);
  };

  const handleMouseOverStar = value => {
    setHoverValue(value)
};

  const handleMouseLeaveStar = () => {
      setHoverValue(undefined)
  };

  const handleClickStar = value => {
    setRating(value)
};

const colors = {
  orange: "#F2C265",
  grey: "a9a9a9"
}

  const stars = Array(5).fill(0);
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

              {isReviewExisting ? (
        <View>
          <Text>Review: {review}</Text>
          <Text>Rating: {rating}</Text>
        </View>
      ) : (
        <View>
        <TextInput
          style={styles.commentInput}
          placeholder="Napiši komentar..."
          multiline
          onChangeText={(value) => {
            setReview(value);
            if (profile.userBooks && profile.userBooks["Vlak u snijegu"]) {
              setProfile({
                ...profile,
                userBooks: {
                  ...profile.userBooks,
                  "Vlak u snijegu": {
                    ...profile.userBooks["Vlak u snijegu"],
                    review: value,
                  },
                },
              });
            }
          }}
        />

        <div>
            {stars.map((_, index) => {
                  return (
                      <FaStar
                          key={index}
                          size={24}
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          color={(hoverValue || rating) > index ? colors.orange : colors.grey}
                          onClick={() => handleClickStar(index + 1)}
                          onMouseOver={() => handleMouseOverStar(index + 1)}
                          onMouseLeave={() => handleMouseLeaveStar}
                        />
                  )
              })}
          </div>
          <br />
              <TouchableOpacity style={styles.editButton} onPress={handleSaveReview}>
              <Text style={styles.editButtonText}>Spremi recenziju</Text>
            </TouchableOpacity>
          </View>
          )}
        <br />
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
