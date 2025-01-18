import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PronadjiKnjiznicu from "./PronadjiKnjiznicu";
import DodajKnjigu from "./DodajKnjigu";
import { createStackNavigator } from "@react-navigation/stack";
import ProfilStack from "./ProfilStack";
import KnjigaStack from "./KnjigaStack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function LoggedInTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Profil") {
            iconName = "person";
          } else if (route.name === "Lista knjiga") {
            iconName = "list";
          } else if (route.name === "Pronađi knjižnicu") {
            iconName = "search";
          } else if (route.name === "Dodaj knjigu") {
            iconName = "note-add";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e8def8",
        tabBarInactiveTintColor: "#49454f",
        tabBarStyle: {
          backgroundColor: "#f3edf7",
        },
        headerTintColor: "#6c4255",
        headerStyle: {
          backgroundColor: "#f6e2ee",
        },
        headerTitleStyle: {
          fontSize: 20,
        },
      })}
    >
      <Tab.Screen name="Profil" component={ProfilStack} />
      <Tab.Screen name="Lista knjiga" component={KnjigaStack} />
      <Tab.Screen name="Pronađi knjižnicu" component={PronadjiKnjiznicu} />
      <Tab.Screen name="Dodaj knjigu" component={DodajKnjigu} />
    </Tab.Navigator>
  );
}
