import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>¿Qué quieres hacer?</Text>
      <Button
        title="Control marcador"
        onPress={() => navigation.navigate("Control marcador")}
      />
      <Text></Text>
      <Text>-------------------------------------------------------</Text>
      <Text></Text>
      <Button
        title="Crear nueva publicidad"
        onPress={() => navigation.navigate("Crear publicidad")}
      />
      <Text></Text>
      <Text>-------------------------------------------------------</Text>
      <Text></Text>
      <Button
        title="Eliminar publicidad"
        onPress={() => navigation.navigate("Eliminar publicidad")}
      />
      <Text></Text>
      <Text>-------------------------------------------------------</Text>
      <Text></Text>
      <Button
        title="Activar publicidad"
        onPress={() => navigation.navigate("Activar publicidad")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
