import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {firebase} from '../../../config';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const Home = ({navigation}) => {
  const [todos, setTodos] = useState([]);
  const todoRef = firebase.firestore().collection('todos');
  const [addData, setAddData] = useState('');

  // fetching data from firestore
  useEffect(() => {
    todoRef.orderBy('createdAt', 'desc').onSnapshot(querySnapshot => {
      const todos = [];
      querySnapshot.forEach(doc => {
        const {heading} = doc.data();
        todos.push({id: doc.id, heading});
      });
      setTodos(todos);
    });
  }, []);

  // adding todo
  const addTodo = () => {
    if (addData && addData.length > 0) {
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
      todoRef.add({heading: addData, createdAt: timeStamp});
      setAddData('');
      Keyboard.dismiss();
    }
  };

  // deleting todo
  const deleteTodo = todos => {
    todoRef
      .doc(todos.id)
      .delete()
      .then(() => alert('Deleted successfully'))
      .catch(error => {
        alert(error);
      });
  };

  return (
    <View style={{flex: 1}}>
      <Text>Home Screen</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={addData}
          onChangeText={heading => setAddData(heading)}
          placeholder="Enter todo"
          placeholderTextColor="#aaaaaa"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        key={'_'}
        data={todos}
        numColumns={1}
        renderItem={({item}) => (
          <View>
            <Pressable
              style={styles.container}
              onPress={() => navigation.navigate('Details', {item})}>
              <TouchableOpacity onPress={() => deleteTodo(item)}>
                <Text>Delete</Text>
              </TouchableOpacity>
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>
                  {item.heading[0].toUpperCase() + item.heading.slice(1)}
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e5e5",
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center"
  },

  innerContainer: {
    alignItems: "center",
    flexDirection: "column",
    marginLeft: 45,
  },
  
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },

  formContainer: {
    flexDirection: "row",
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },

  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },

  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 20
  }

});
