import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { avatarNames, avatarImages, AvatarName } from '../../assets/images/avatar';
import { useFocusEffect } from '@react-navigation/native';
import PillButton from '../components/Buttons';
import AvatarSelector from '../components/AvatarSelector';

export default function ProfileScreen({ navigation }: any) {
  const [avatar, setAvatar] = useState<AvatarName | null>(null);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [userName, setUserName] = useState('Arthur Bragança');
  const [userEmail, setUserEmail] = useState('arthur@example.com');
  const [stats, setStats] = useState({ played: 42, daily: 5, weekly: 20, monthly: 100, created: 10 });
  const [isAuth, setIsAuth] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarName | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuth(true);
      setUserName(res.data.username);
      setUserEmail(res.data.email);
      const pic = res.data.profile_picture || res.data.avatar_url;
      if (pic && avatarNames.includes(pic)) {
        setAvatar(pic as AvatarName);
        setProfileUri(null);
      } else if (pic) {
        setProfileUri(pic);
        setAvatar(null);
      }
      setStats({
        played: res.data.games_played,
        daily: res.data.daily_score,
        weekly: res.data.weekly_score,
        monthly: res.data.monthly_score,
        created: res.data.challenges_created,
      });
    } catch (e) {
      console.log(e);
      setIsAuth(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
         {isAuth ? (
          <View style={styles.card}>
            {/* <TouchableOpacity style={styles.avatarWrapper}> */}
              <Image
                source={avatar ? avatarImages[avatar] : { uri: profileUri || undefined }}
                style={styles.avatar}
              />
              {/* <View style={styles.cameraOverlay}>
                <Ionicons name="camera-outline" size={20} color="#fff" />
              </View> */}
            {/* </TouchableOpacity> */}

          <Text style={styles.cardTitle}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.played}</Text>
              <Text style={styles.statLabel}>Played</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.created}</Text>
              <Text style={styles.statLabel}>Created</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.daily}</Text>
              <Text style={styles.statLabel}>Daily</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.weekly}</Text>
              <Text style={styles.statLabel}>Weekly</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.monthly}</Text>
              <Text style={styles.statLabel}>Monthly</Text>
            </View>
          </View>


            <PillButton 
            onPress={() => navigation.navigate('EditProfile')}
            title="Edit Profile"
            />

            <PillButton
              title ="Log Out"
              variant="inverse"
              onPress={handleLogout}
            />

          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Unlock More Features</Text>
             <Text style={styles.bodyText}>
               Sign up to save your progress, create your own challenges, and access premium tools!
             </Text>
             <PillButton
               title="Log In"  
               variant="inverse"
               borderColor="#fff"
               onPress={() => navigation.navigate('Login')}
             />
            <PillButton
              title="Sign Up"
              backgroundColor="#fff"
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#83A3F2',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 16,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  email: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#e0e0e0',
  },
  button: {
    backgroundColor: '#9fbaf9',
    borderRadius: 5,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 12,
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  bodyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  // cameraOverlay: {
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   backgroundColor: '#4B73E5',
  //   padding: 6,
  //   borderRadius: 16,
  //   borderWidth: 2,
  //   borderColor: '#fff',
  // },
});





// import React, { useState, useCallback } from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// import { API_BASE_URL } from '../config/api';
// import { avatarNames, avatarImages, AvatarName } from '../../assets/images/avatar';
// import { useFocusEffect } from '@react-navigation/native';
// import PillButton from '../components/Buttons';

// export default function ProfileScreen({ navigation }: any) {
//   const [avatar, setAvatar] = useState<AvatarName | null>(null);
//   const [profileUri, setProfileUri] = useState<string | null>(null);
//   const [userName, setUserName] = useState('Arthur Bragança');
//   const [userEmail, setUserEmail] = useState('arthur@example.com');
//   const [stats, setStats] = useState({
//     played: 42,
//     daily: 5,
//     weekly: 20,
//     monthly: 100,
//     created: 10,
//   });
//   const [isAuth, setIsAuth] = useState(false);

//   const loadUser = useCallback(async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get(`${API_BASE_URL}/users/me/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setIsAuth(true);
//       setUserName(res.data.username);
//       setUserEmail(res.data.email);
//       const pic = res.data.profile_picture || res.data.avatar_url;
//       if (pic && avatarNames.includes(pic)) {
//         setAvatar(pic as AvatarName);
//         setProfileUri(null);
//       } else if (pic) {
//         setProfileUri(pic);
//         setAvatar(null);
//       }
//       setStats({
//         played: res.data.games_played,
//         daily: res.data.daily_score,
//         weekly: res.data.weekly_score,
//         monthly: res.data.monthly_score,
//         created: res.data.challenges_created,
//       });
//     } catch (e) {
//       console.log(e);
//       setIsAuth(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       loadUser();
//     }, [loadUser])
//   );

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     navigation.navigate('Login');
//   };

//   return (
//     <LinearGradient colors={['#6C63FF', '#3A3DFF']} style={styles.container}>
//       <SafeAreaView style={styles.content}>
//         {isAuth ? (
//           <View style={styles.card}>
//             <Image
//               source={avatar ? avatarImages[avatar] : { uri: profileUri || undefined }}
//               style={styles.avatar}
//             />
//             <Text style={styles.cardTitle}>{userName}</Text>
//             <Text style={styles.email}>{userEmail}</Text>

//             <View style={styles.statsRow}>
//               <View style={styles.statBox}>
//                 <Text style={styles.statValue}>{stats.played}</Text>
//                 <Text style={styles.statLabel}>Played</Text>
//               </View>
//               <View style={styles.statBox}>
//                 <Text style={styles.statValue}>{stats.created}</Text>
//                 <Text style={styles.statLabel}>Created</Text>
//               </View>
//             </View>
//             <View style={styles.statsRow}>
//               <View style={styles.statBox}>
//                 <Text style={styles.statValue}>{stats.daily}</Text>
//                 <Text style={styles.statLabel}>Daily</Text>
//               </View>
//               <View style={styles.statBox}>
//                 <Text style={styles.statValue}>{stats.weekly}</Text>
//                 <Text style={styles.statLabel}>Weekly</Text>
//               </View>
//               <View style={styles.statBox}>
//                 <Text style={styles.statValue}>{stats.monthly}</Text>
//                 <Text style={styles.statLabel}>Monthly</Text>
//               </View>
//             </View>

//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => navigation.navigate('EditProfile')}
//             >
//               <Text style={styles.primaryButtonText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={handleLogout}
//             >
//               <Text style={styles.secondaryButtonText}>Log Out</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Unlock More Features</Text>
//             <Text style={styles.bodyText}>
//               Sign up to save your progress, create your own challenges, and access premium tools!
//             </Text>
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => navigation.navigate('Register')}
//             >
//               <Text style={styles.primaryButtonText}>Sign Up</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={() => navigation.navigate('Login')}
//             >
//               <Text style={styles.secondaryButtonText}>Log In</Text>
//             </TouchableOpacity>
//           </View>

          

//         )}
//       </SafeAreaView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 24,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   avatar: {
//     marginBottom: 16,
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   cardTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   email: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   bodyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//     lineHeight: 22,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   statBox: {
//     alignItems: 'center',
//     marginHorizontal: 16,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//   },
//   primaryButton: {
//     backgroundColor: '#6C63FF',
//     borderRadius: 30,
//     paddingVertical: 14,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   primaryButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   secondaryButton: {
//     backgroundColor: 'transparent',
//     borderRadius: 30,
//     paddingVertical: 14,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: '#6C63FF',
//   },
//   secondaryButtonText: {
//     color: '#6C63FF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });