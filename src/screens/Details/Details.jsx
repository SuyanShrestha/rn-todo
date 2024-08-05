import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { firebase } from '../../../config';
import colors from '../../constants/colors';
import categories from '../../constants/categories';

const Details = ({ navigation, route }) => {
  const todoRef = firebase.firestore().collection('todos');
  const [textHeading, setTextHeading] = useState(route.params.item.heading);
  const [selectedCategory, setSelectedCategory] = useState(route.params.item.category);

  useEffect(() => {
    setSelectedCategory(route.params.item.category);
  }, [route.params.item.category]);

  const updateTodo = () => {
    if (textHeading && textHeading.length > 0) {
      todoRef
        .doc(route.params.item.id)
        .update({
          heading: textHeading,
          category: selectedCategory,
        })
        .then(() => {
          navigation.navigate('Home');
        })
        .catch(error => alert(error.message));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Todo</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setTextHeading(text)}
        value={textHeading}
        placeholder="Update Todo"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((cat, index) => (
          <View key={index} style={styles.categoryContainer}>
            <View 
              style={[
                styles.categoryColorSquare, 
                { backgroundColor: cat.color },
                selectedCategory === cat.name && styles.categoryColorSquareSelected
              ]}
            />
            <TouchableOpacity 
              style={[
                styles.categoryButton, 
                selectedCategory === cat.name && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text style={styles.categoryButtonText}>{cat.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={updateTodo}>
        <Text style={styles.buttonText}>Update Todo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: colors.primaryColor60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.secondaryBgColor10,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    paddingLeft: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryColor30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondaryBgColor10,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  categoryButton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.unselectedCategory,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  categoryButtonSelected: {
    backgroundColor: colors.secondaryBgColor10,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categoryColorSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryColorSquareSelected: {
    borderColor: colors.secondaryBgColor10,
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.secondaryBgColor10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Details;
