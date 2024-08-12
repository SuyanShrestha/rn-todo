import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { firebase } from '../../../config';
import DatePicker from 'react-native-date-picker';
import notifee from '@notifee/react-native';
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
        color: categoryColor, // Set the background color based on category
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

const Details = ({ navigation, route }) => {
  const todoRef = firebase.firestore().collection('todos');
  const [textHeading, setTextHeading] = useState(route.params.item.heading);
  const [selectedCategory, setSelectedCategory] = useState(route.params.item.category);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date

  useEffect(() => {
    setSelectedCategory(route.params.item.category);
  }, [route.params.item.category]);

  const updateTodo = () => {
    if (textHeading && textHeading.length > 0) {
      navigation.navigate('HomeScreen');
  
      todoRef
        .doc(route.params.item.id)
        .update({
          heading: textHeading,
          category: selectedCategory,
          notificationDate: selectedDate, // Update the selected notification date
        })
        .then(() => {
          // Schedule notification after the Firestore update is successful
          if (selectedDate) {
            const categoryColor = categories.find(cat => cat.name === selectedCategory)?.color || colors.defaultColor;
            scheduleNotification(selectedDate, textHeading, categoryColor);
          }
        })
        .catch(error => {
          // Handle any errors that occur during the update or scheduling
          console.error('Error updating todo:', error.message);
        });
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

      <Text style={styles.label}>Set Notification Date & Time</Text>
      <DatePicker
        date={selectedDate}
        onDateChange={setSelectedDate}
        mode="datetime" // You can choose date, time, or datetime
      />

      <TouchableOpacity style={styles.button} onPress={updateTodo}>
        <Text style={styles.buttonText}>Update Todo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Details;

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
    borderColor: colors.primaryColor60,
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
