import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import moment from 'moment';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faMugSaucer,
  faSquare,
  faCheckSquare,
  faPencil,
} from '../../constants/icons';
import colors from '../../constants/colors';

const TodoItem = ({item, toggleComplete, deleteTodo, categoryColor, navigation}) => {
  return (
    <View style={[styles.container, { borderLeftColor: categoryColor, borderLeftWidth: 5 }]}>
      <TouchableOpacity onPress={() => deleteTodo(item)}>
        <Text>Delete</Text>
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <View style={styles.headingContainer}>
          <Text
            style={[
              styles.itemHeading,
              item.completed && styles.completedHeading,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.heading[0].toUpperCase() + item.heading.slice(1)}
          </Text>
        </View>
        <Text style={styles.itemTime}>
          {item.createdAt
            ? moment(item.createdAt.toDate()).calendar()
            : 'Loading...'}
        </Text>
      </View>

      <View style={styles.buttonsDiv}>
        <TouchableOpacity onPress={() => toggleComplete(item)}>
          <FontAwesomeIcon
            icon={item.completed ? faCheckSquare : faSquare}
            size={20}
            color={item.completed ? colors.secondaryBgColor10 : 'lightgrey'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Details', {item})}>
          <FontAwesomeIcon icon={faPencil} size={20} color={colors.secondaryBgColor10} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBgColor30,
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerContainer: {
    alignItems: 'flex-start',
    gap: 5,
    flexDirection: 'column',
    marginLeft: 15,
    width: '60%',
  },
  headingContainer: {
    width: '100%',
  },
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  completedHeading: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  itemTime: {
    fontSize: 12,
    color: '#888',
  },
  buttonsDiv: {
    gap: 20,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default TodoItem;
