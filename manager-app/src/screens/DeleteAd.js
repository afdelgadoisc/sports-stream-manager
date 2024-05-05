import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { getAllAds, deleteAd } from "../services/AdService";

const DeleteAd = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);


  useEffect(() => {
    const loadItems = async () => {
      const data = await getAllAds();
      setItems(data);
    };

    loadItems();
  }, []);

  const handleSelectItem = (id) => {
    setSelectedId(id);
  };

  const handleDeleteItem = async () => {
    if (selectedId === null) {
      Alert.alert('No ha seleccionado una publicidad', 'Por favor seleccione una publicidad para eliminar');
      return;
    }

    try {
      await deleteAd(selectedId);
      setItems(prevItems => prevItems.filter(item => item !== selectedId));
      setSelectedId(null);
      ToastAndroid.show(
        "Publicidad eliminada satisfactoriamente",
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error('Error eliminando la publicidad', error);
    }
  };

  return (
    <View style={styles.container}>
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
      <Button color="#de4f2f" title="Eliminar la publicidad seleccionada" onPress={handleDeleteItem} />
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
});

export default DeleteAd;

