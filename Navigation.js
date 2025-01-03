import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import LoggedOutView from "./components/LoggedOutView";
import LoggedInView from "./components/LoggedInView";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoggedInTabs from "./components/LoggedInTabs";

const Stack = createStackNavigator();


export default Navigation = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {
                    isLoggedIn ? (
                        <Stack.Screen name="Dobrodošli" component={LoggedInTabs} options={{headerShown: false}} />
                    ) : (
                        <Stack.Screen name="Prijavite se" component={LoggedOutView} options={{ headerShown: false }} />
                    )
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
};