import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {firebase} from '../../../config';

import colors from '../../constants/colors';
import categories from '../../constants/categories';

import TodoItem from '../../components/TodoItem/TodoItem';

const Home = ({navigation, route}) => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filters, setFilters] = useState({
    selectedTime: null,
    selectedCategory: null,
    showIncomplete: false,
  });
  const [originalTodos, setOriginalTodos] = useState([]); 
  const todoRef = firebase.firestore().collection('todos');

  // fetching data from firestore
  useEffect(() => {
    const unsubscribe = todoRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const todos = [];
        querySnapshot.forEach(doc => {
          const {heading, createdAt, completed, category} = doc.data();
          todos.push({id: doc.id, heading, createdAt, completed, category});
        });
        setTodos(todos);
        setOriginalTodos(todos); // original todo made for clearFilter function
        setFilteredTodos(todos); 
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, todos]);

  useEffect(() => {
    if (route.params) {
      const {selectedTime, selectedCategory, showIncomplete} = route.params;
      if (selectedTime || selectedCategory || showIncomplete !== undefined) {
        setFilters({
          selectedTime,
          selectedCategory,
          showIncomplete,
        });
      } else {
        // if no filter, will just use originalTodo that i made earlier
        setFilteredTodos(originalTodos);
      }
    }
  }, [route.params]);

  const applyFilters = () => {
    let filteredList = [...todos];

    // Filter by category
    if (filters.selectedCategory) {
      filteredList = filteredList.filter(
        todo => todo.category === filters.selectedCategory,
      );
    }

    // Filter by completion status
    if (filters.showIncomplete) {
      filteredList = filteredList.filter(todo => !todo.completed);
    }

    // Sort by time
    if (filters.selectedTime === 'newToOld') {
      filteredList.sort((a, b) => b.createdAt - a.createdAt);
    } else if (filters.selectedTime === 'oldToNew') {
      filteredList.sort((a, b) => a.createdAt - b.createdAt);
    }

    setFilteredTodos(filteredList);
  };

  // deleting todo
  const deleteTodo = todo => {
    todoRef
      .doc(todo.id)
      .delete()
      .then(() => alert('Deleted successfully'))
      .catch(error => {
        alert(error);
      });
  };

  // complete checkbox
  const toggleComplete = todo => {
    todoRef
      .doc(todo.id)
      .update({completed: !todo.completed})
      .catch(error => {
        alert(error);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.primaryColor60}}>
      <Text style={styles.title}>Home Screen</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTodo')}>
        <Text style={styles.addButtonText}>Add Todo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => navigation.navigate('Filter', {filters})}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <FlatList
        keyExtractor={item => item.id}
        data={filteredTodos}
        numColumns={1}
        renderItem={({item}) => (
          <TodoItem
            item={item}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            navigation={navigation}
            categoryColor={
              categories.find(cat => cat.name === item.category)?.color
            }
          />
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  addButton: {
    height: 47,
    borderRadius: 5,
    backgroundColor: colors.secondaryBgColor10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  filterButton: {
    height: 47,
    borderRadius: 5,
    backgroundColor: colors.secondaryBgColor10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
