import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {firebase} from '../../../config';

import colors from '../../constants/colors';

const Details = ({navigation, route}) => {
  const todoRef = firebase.firestore().collection('todos');
  const [textHeading, setTextHeading] = useState(route.params.item.name);

  const updateTodo = () => {
    if (textHeading && textHeading.length > 0) {
      todoRef
        .doc(route.params.item.id)
        .update({
          heading: textHeading,
        })
        .then(() => {
          navigation.navigate('Home');
        })
        .catch(error => alert(error.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text>Details</Text>
      <TextInput
        style={styles.textField}
        onChangeText={text => setTextHeading(text)}
        value={textHeading}
        placeholder="Update Todo"
      />
      <TouchableOpacity style={styles.buttonUpdate} onPress={updateTodo}>
        <Text style={styles.buttonUpdateText}>Update Todo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: colors.primaryTextColor60,
    backgroundColor: colors.textInputBackground,
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: colors.secondaryBgColor10,
  },
  buttonUpdateText: {
    color: colors.secondaryText30,
    fontSize: 16,
  },
});
