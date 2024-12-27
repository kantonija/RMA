import React from "react";
import {Text, View} from "react-native";

export default function ErrorMessage ({error}) {
    if (!error) return null;
    return (
        <View>
            <Text>
                {error}
            </Text>
        </View>
    );
}