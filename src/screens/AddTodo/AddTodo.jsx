import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../../../config';

// constants
import colors from '../../constants/colors';
import categories from '../../constants/categories';

const AddTodo = ({ navigation }) => {
  const [addData, setAddData] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const todoRef = firebase.firestore().collection('todos');

  const addTodo = () => {
    if (addData && addData.length > 0) {
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
      todoRef.add({ heading: addData, createdAt: timeStamp, completed: false, category });
      setAddData('');
      Keyboard.dismiss();
      navigation.goBack();  
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.primaryColor60 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Add New Todo</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={addData}
          onChangeText={heading => setAddData(heading)}
          placeholder="Enter todo"
          placeholderTextColor="#aaaaaa"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat, index) => (
            <View key={index} style={styles.categoryContainer}>
              <View 
                style={[
                  styles.categoryColorSquare, 
                  { backgroundColor: cat.color },
                  category === cat.name && styles.categoryColorSquareSelected
                ]}
              />
              <TouchableOpacity 
                style={[
                  styles.categoryButton, 
                  category === cat.name && styles.categoryButtonSelected
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Text style={styles.categoryButtonText}>{cat.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddTodo;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primaryColor10,
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
    color: colors.primaryColor10,
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
