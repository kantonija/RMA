import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profil from './Profil';
import UrediProfil from './UrediProfil';

const Stack = createStackNavigator();

export default function ProfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profil" 
        component={Profil} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="UrediProfil" 
        component={UrediProfil} 
        options={{
          headerTitle: 'Uredi profil',
          headerTintColor: '#6c4255', 
          headerStyle: { backgroundColor: '#f6e2ee' },
          headerTitleStyle: { fontSize: 18 },
        }}
      />
    </Stack.Navigator>
  );
}
