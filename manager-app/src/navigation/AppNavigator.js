import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScoreboardController from "../screens/ScoreboardController";
import CreateAd from "../screens/CreateAd";
import DeleteAd from "../screens/DeleteAd";
import ActivateAd from "../screens/ActivateAd";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Inicio">
      <Stack.Screen name="Inicio" component={HomeScreen} />
      <Stack.Screen name="Control marcador" component={ScoreboardController} />
      <Stack.Screen name="Crear publicidad" component={CreateAd} />
      <Stack.Screen name="Eliminar publicidad" component={DeleteAd} />
      <Stack.Screen name="Activar publicidad" component={ActivateAd} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
