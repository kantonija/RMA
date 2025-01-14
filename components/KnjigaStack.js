import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListaKnjiga from "./ListaKnjiga";
import DetaljiKnjige from "./DetaljiKnjige";
import UrediKnjigu from "./UrediKnjigu";
import UrediAutora from "./UrediAutora";

const Stack = createStackNavigator();

export default function KnjigaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ListaKnjiga" component={ListaKnjiga} options={{ headerShown: false }} />
      <Stack.Screen name="DetaljiKnjige" component={DetaljiKnjige} options={{title: "Detalji knjige" , 
        headerTintColor: '#6c4255', 
        headerStyle: { backgroundColor: '#f6e2ee' },
        headerTitleStyle: { fontSize: 18 }}}/>
      <Stack.Screen name="UrediKnjigu" component={UrediKnjigu} options={{ title: "Uredi Knjigu",
        headerTintColor: '#6c4255', 
        headerStyle: { backgroundColor: '#f6e2ee' },
        headerTitleStyle: { fontSize: 18 }}} />
      <Stack.Screen name="UrediAutora" component={UrediAutora} options={{ title: "O autoru",
        headerTintColor: '#6c4255', 
        headerStyle: { backgroundColor: '#f6e2ee' },
        headerTitleStyle: { fontSize: 18 }}} />

    </Stack.Navigator>
  );
}