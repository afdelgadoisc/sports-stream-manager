import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { getAllAds, getActiveAd, updateActiveAd } from "../services/AdService";

const ActivateAd = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeAd, setActiveAd] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      const data = await getAllAds();
      setItems(data);
    };

    const loadActiveAd = async () => {
      const data = await getActiveAd();
      setActiveAd(data);
    }

    loadItems();
    loadActiveAd();
  }, []);

  const handleSelectItem = (id) => {
    setSelectedId(id);
  };

  const handleDeleteItem = async () => {
    if (selectedId === null) {
      Alert.alert('No ha seleccionado una publicidad', 'Por favor seleccione una publicidad para activar');
      return;
    }

    try {
      const response = await updateActiveAd(selectedId);
      setSelectedId(null);
      setActiveAd(response);
      ToastAndroid.show(
        "Publicidad " + response + " activada satisfactoriamente",
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error('Error activando la publicidad', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>La publicidad activa ahora es: {activeAd}</Text>
      <FlatList
        data={items}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              item === selectedId && styles.selected
            ]}
            onPress={() => handleSelectItem(item)}
          >
            <Text style={styles.title}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Activar la publicidad seleccionada" onPress={handleDeleteItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  selected: {
    backgroundColor: '#6e3b',
  },
  title: {
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default ActivateAd;
