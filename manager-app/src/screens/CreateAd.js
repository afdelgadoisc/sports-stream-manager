// src/screens/NamesListScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { getAllBanners, createAd } from "../services/AdService";

const CreateAd = ({ navigation }) => {
  const [names, setNames] = useState([]);
  const [selectedNames, setSelectedNames] = useState(new Set());
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const loadNames = async () => {
      const data = await getAllBanners();
      setNames(data);
    };

    loadNames();
  }, []);

  const handleSelectName = (name) => {
    const newSet = new Set(selectedNames);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setSelectedNames(newSet);
  };

  const handleCreateGroup = async () => {
    if (selectedNames.size === 0 || groupName.trim() === "" || groupName === "publi") {
      alert(
        "Selecciona al menos un banner y escribe un nombre para la publicidad que no sea publi"
      );
      return;
    }

    const response = createAd([...selectedNames], groupName.replace(/\s/g, ''));
    if (response.error) {
      alert("Error al crear la publicidad");
      return;
    }
    ToastAndroid.show(
      "Publicidad creada satisfactoriamente",
      ToastAndroid.SHORT
    );
    setSelectedNames(new Set());
    setGroupName("");
    navigation.navigate("Inicio");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={names}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.nameItem,
              selectedNames.has(item) && styles.selected,
            ]}
            onPress={() => handleSelectName(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Ingrese el nombre de la publicidad"
      />
      <Button title="Crear publicidad" onPress={handleCreateGroup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  nameItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selected: {
    backgroundColor: "#ddd",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CreateAd;
