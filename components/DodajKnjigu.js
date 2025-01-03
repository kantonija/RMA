import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import PageDesign from "./ui/PageDesign";

const PronadjiKnjiznicu = () => {
  return (
    <PageDesign>
      <TextInput
        style={styles.input1}
        placeholder="Unesite ime knjige"
        value={""} />
        <TextInput
        style={styles.input2}
        placeholder="Unesite ime pisca"
        value={""} />
        <TextInput
        style={styles.input3}
        placeholder="Unesite broj stranica"
        value={""} />
        <TextInput
        style={styles.input4}
        placeholder="Unesite žanr knjige"
        value={""} />
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>   Učitaj fotografiju</Text>
      </TouchableOpacity>
      <View
              style={{
                width: 150,
                height: 150,
                backgroundColor: "white",
                borderRadius: 10,
                borderColor: "#ddd",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                top: "-13%",
                left: "-18%",	
              }}
            >
            </View>
    </PageDesign>
  );
};

const styles = StyleSheet.create({
  input1: {
    width: "70%",
    top: "-10%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    zIndex: 3,
  },
  input2: {
    width: "70%",
    top: "-9%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    zIndex: 3,
  },
  input3: {
    width: "70%",
    top: "-8%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    zIndex: 3,
  },
  input4: {
    width: "70%",
    top: "-7%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    zIndex: 3,
  },
  button: {
    top: "9%",
    right: -110,
    width: "25%",
    height: 60,
    borderColor: "transparent",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  buttonText: {
    color: "##6c4255",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PronadjiKnjiznicu;