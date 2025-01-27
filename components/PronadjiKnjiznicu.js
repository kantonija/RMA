import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView,TouchableOpacity } from "react-native";
import PageDesign from "./ui/PageDesign";
import * as Location from "expo-location";

const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') { const location = await Location.getCurrentPositionAsync({}); 
  console.log(location);}

  const location = await Location.getCurrentPositionAsync({});
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

const findNearbyLibraries = async (latitude, longitude) => {
  const radius = 10 * 1000;
  const query = "library"; 

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&bounded=1&viewbox=${longitude - 0.5},${latitude + 0.5},${longitude + 0.5},${latitude - 0.5}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return data.map((place) => ({
      name: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    }));
  } catch (error) {
    console.error("Greška kod dohvaćanja podataka:", error);
    alert("Dogodila se greška kod pretraživanja.");
    return [];
  }
};

const PronadjiKnjiznicu = () => {
  const [libraries, setLibraries] = useState([]);

  const handleFindLibraries = async () => {
    const location = await getLocation();
    if (location) {
      const results = await findNearbyLibraries(location.latitude, location.longitude);
      setLibraries(results);
    }
  };

  return (
    <PageDesign>
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleFindLibraries}>
          <Text style={styles.buttonText}>Pronađi knjižnice u blizini</Text>
        </TouchableOpacity>        <ScrollView style={styles.results}>
          {libraries.map((library, index) => (
            <View key={index} style={styles.libraryItem}>
              <Text style={styles.name}>{library.name}</Text>
              <Text style={styles.coordinates}>
                ({library.latitude}, {library.longitude})
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 600,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    padding: 10,
  },
  results: {
    marginTop: 20,
    width: "100%",
  },
  libraryItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  coordinates: {
    color: "gray",
  },
  buttonn: {
    width: '45%', 
      maxWidth: 150, 
      height: 35,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#986BFC",
      backgroundColor: "#986BFC",
      justifyContent: "center",
      alignItems: "center",
  }
});

export default PronadjiKnjiznicu;
