import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {firebase} from '../../../config';
import colors from '../../constants/colors';
import categories from '../../constants/categories';

const StatsScreen = () => {
  const [todos, setTodos] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});
  const [overallStats, setOverallStats] = useState({
    total: 0,
    completed: 0,
    percentage: 0,
  });

  const todoRef = firebase.firestore().collection('todos');

  useEffect(() => {
    const unsubscribe = todoRef.onSnapshot(querySnapshot => {
      const todos = [];
      querySnapshot.forEach(doc => {
        const {heading, createdAt, completed, category} = doc.data();
        todos.push({id: doc.id, heading, createdAt, completed, category});
      });
      setTodos(todos);
      calculateStats(todos);
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = todos => {
    const categoryStats = {};
    let totalCompleted = 0;

    categories.forEach(category => {
      const todosInCategory = todos.filter(todo => todo.category === category.name);
      const completedInCategory = todosInCategory.filter(todo => todo.completed).length;
      categoryStats[category.name] = {
        total: todosInCategory.length,
        completed: completedInCategory,
      };
      totalCompleted += completedInCategory;
    });

    const totalTodos = todos.length;
    const completedTodos = totalCompleted;
    const percentage = totalTodos ? (completedTodos / totalTodos) * 100 : 0;

    setCategoryStats(categoryStats);
    setOverallStats({
      total: totalTodos,
      completed: completedTodos,
      percentage: percentage.toFixed(2), 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      <FlatList
        data={Object.keys(categoryStats)}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.categoryStat}>
            <Text style={styles.categoryText}>
              {item}: {categoryStats[item].completed}/{categoryStats[item].total}
            </Text>
          </View>
        )}
      />

      <View style={styles.overallStat}>
        <Text style={styles.overallText}>
          Overall Completion: {overallStats.completed}/{overallStats.total} ({overallStats.percentage}%)
        </Text>
      </View>
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primaryColor60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryStat: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.unselectedCategory,
  },
  categoryText: {
    fontSize: 18,
    color: colors.selectedCategory,
  },
  overallStat: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.secondaryBgColor30,
    borderRadius: 8,
  },
  overallText: {
    fontSize: 20,
    color: colors.selectedCategory,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
