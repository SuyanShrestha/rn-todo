import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import categories from '../../constants/categories';

const FilterScreen = ({navigation, route}) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showIncomplete, setShowIncomplete] = useState(false);

  useEffect(() => {
    if (route.params?.filters) {
      const {selectedTime, selectedCategory, showIncomplete} =
        route.params.filters;
      setSelectedTime(selectedTime);
      setSelectedCategory(selectedCategory);
      setShowIncomplete(showIncomplete);
    }
  }, [route.params?.filters]);

  const applyFilters = () => {
    navigation.navigate('HomeScreen', {
      selectedTime,
      selectedCategory,
      showIncomplete,
    });
  };

  const clearFilters = () => {
    navigation.navigate('HomeScreen', {
      selectedTime: null,
      selectedCategory: null,
      showIncomplete: false,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Todos</Text>

      <Text style={styles.label}>Time</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTime === 'newToOld' && styles.selectedOption,
          ]}
          onPress={() => setSelectedTime('newToOld')}>
          <Text style={styles.optionText}>New to Old</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTime === 'oldToNew' && styles.selectedOption,
          ]}
          onPress={() => setSelectedTime('oldToNew')}>
          <Text style={styles.optionText}>Old to New</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Category</Text>
      <View style={styles.optionsContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.optionButton,
              selectedCategory === cat.name && styles.selectedOption,
            ]}
            onPress={() => setSelectedCategory(cat.name)}>
            <Text style={styles.optionText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Completion Status</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, showIncomplete && styles.selectedOption]}
          onPress={() => setShowIncomplete(!showIncomplete)}>
          <Text style={styles.optionText}>Incomplete</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
        <Text style={styles.clearButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primaryColor60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.secondaryBgColor10,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondaryBgColor10,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.unselectedCategory,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: colors.secondaryBgColor10,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  applyButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.secondaryBgColor10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
