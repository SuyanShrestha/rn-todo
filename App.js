import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home/Home';
import Details from './src/screens/Details/Details';
import AddTodo from './src/screens/AddTodo/AddTodo';
import FilterScreen from './src/screens/FilterScreen/FilterScreen';
import Stats from './src/screens/Stats/Stats';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faChartPie } from './src/constants/icons';
import colors from './src/constants/colors';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="Details" component={Details} />
      <HomeStack.Screen name="AddTodo" component={AddTodo} />
      <HomeStack.Screen name="Filter" component={FilterScreen} />
    </HomeStack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = faHome;
            } else if (route.name === 'Stats') {
              iconName = faChartPie;
            }
            return (
              <FontAwesomeIcon
                icon={iconName}
                size={20}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: colors.secondaryBgColor10, 
          tabBarInactiveTintColor: colors.unselectedCategory, 
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator} />
        <Tab.Screen name="Stats" component={Stats} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
