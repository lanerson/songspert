import React, { useEffect } from 'react';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Screens
import LoginScreen       from './src/screens/Login';
import RegisterScreen    from './src/screens/Register';
import HomeScreen        from './src/screens/Home';
import SearchScreen      from './src/screens/Search';
import RankingScreen     from './src/screens/Ranking';
import RandomGameScreen  from './src/screens/RandomGame';
import ProfileScreen     from './src/screens/Profile';
import EditProfileScreen from './src/screens/EditProfile'
import QuizScreen        from './src/screens/Quiz';
import GameScreen        from './src/screens/Game';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tab       = createBottomTabNavigator();

// Nest Home, Quiz, Game under Home tab so bottom tabs persist on Quiz
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Quiz"     component={QuizScreen}   />
      <HomeStack.Screen name="Game"     component={GameScreen}   />
    </HomeStack.Navigator>
  );
}

// Main bottom tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';
          if (route.name === 'Home')        iconName = 'home';
          else if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'Ranking')iconName = 'trophy';
          else if (route.name === 'RandomGame') iconName = 'shuffle';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor:   '#fff',
        tabBarInactiveTintColor: '#CFD8FE',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth:  0,
          elevation:       0,
          height:          70,
          paddingBottom:   6,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#4B73E5','#678bec']}
            style={{ flex: 1 }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home"       component={HomeStackScreen} />
      <Tab.Screen name="Search"     component={SearchScreen}   />
      <Tab.Screen name="Ranking"    component={RankingScreen}  />
      <Tab.Screen name="RandomGame" component={RandomGameScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen}   />
    </Tab.Navigator>
  );
}

export default function App() {
  // configure audio mode
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS:     false,
      interruptionModeIOS:    InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS:   true,
      staysActiveInBackground:false,
      shouldDuckAndroid:      true,
      interruptionModeAndroid:InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        {/* Auth flow */}
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Main app with tabs */}
        <RootStack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        {/* now register EditProfile on the root stack */}
        <RootStack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: 'Edit Profile', headerShown:false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
