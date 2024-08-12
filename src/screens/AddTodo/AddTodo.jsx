import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../../../config';
import DatePicker from 'react-native-date-picker';
import notifee from '@notifee/react-native';

// constants
import colors from '../../constants/colors';
import categories from '../../constants/categories';

// Function to display notification
const onDisplayNotification = async (title, categoryColor) => {
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
    });

    // Generate a unique ID for the notification
    const notificationId = `notification_${Date.now()}`;

    await notifee.displayNotification({
      id: notificationId, // Use unique notification ID
      title: title, // Use the title from addData
      body: 'It\'s time to work on your task!',
      android: {
        channelId,
        color: categoryColor,
        pressAction: {
          id: 'default',
        },
      },
    });

    console.log('Notification displayed.');
  } catch (error) {
    console.error('Failed to display notification:', error);
  }
};

// Function to schedule a notification
const scheduleNotification = (selectedDate, title, categoryColor) => {
  const now = new Date().getTime();
  const selectedTime = selectedDate.getTime();
  const delay = selectedTime - now;

  if (delay > 0) {
    setTimeout(() => {
      onDisplayNotification(title, categoryColor);
    }, delay);
    console.log(
      'Notification scheduled to display in',
      delay / 1000,
      'seconds.',
    );
  } else {
    console.error('Selected time is in the past.');
  }
};

const AddTodo = ({ navigation }) => {
  const [addData, setAddData] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const todoRef = firebase.firestore().collection('todos');

  const addTodo = () => {
    if (addData && addData.length > 0) {
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp();
      todoRef.add({
        heading: addData,
        createdAt: timeStamp,
        completed: false,
        category,
        notificationDate: selectedDate, // Save the selected notification date
      });
      setAddData('');
      Keyboard.dismiss();
      navigation.goBack();

      if (selectedDate) {
        const categoryColor = categories.find(cat => cat.name === category)?.color || colors.defaultColor;
        scheduleNotification(selectedDate, addData, categoryColor); 
      }
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

        <Text style={styles.label}>Set Notification Date & Time</Text>
        <DatePicker
          date={selectedDate}
          onDateChange={setSelectedDate}
          mode="datetime"
        />

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
