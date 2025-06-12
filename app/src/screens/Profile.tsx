import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import { avatarNames, avatarImages, AvatarName } from '../../assets/images/avatar';
import PillButton from '../components/Buttons';
import { getToken } from '../services/api';

const pointCategories = ['Daily', 'Weekly', 'Monthly', 'Random'] as const;

type Stats = {
  played: number;
  daily: number;
  weekly: number;
  monthly: number;
  created: number;
  random: number;
};

export default function ProfileScreen({ navigation }: any) {
  const [avatar, setAvatar] = useState<AvatarName | null>(null);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    played: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    created: 0,
    random: 0,
  });
  const [isAuth, setIsAuth] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const token = await getToken();
      console.log("token no login ", token)
      if (!token) {
        setIsAuth(false);
        return;
      }

      const meRes = await axios.get(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = meRes.data;

      setIsAuth(true);
      setUserName(data.username);
      setUserEmail(data.email);


      let pic = data.profile_picture;


      if (pic && avatarNames.includes(pic as AvatarName)) {
        setAvatar(pic as AvatarName);
        setProfileUri(null);
      } else if (pic) {
        setAvatar(null);
        setProfileUri(pic);
      } else {
        setAvatar(null);
        setProfileUri(null);
      }

      // --- fetch ranking periods in parallel ---
      const userId = data.id ?? data.user_id;
      const [dayRes, weekRes, monthRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/ranking`, { params: { period: 'day' } }),
        axios.get(`${API_BASE_URL}/ranking`, { params: { period: 'week' } }),
        axios.get(`${API_BASE_URL}/ranking`, { params: { period: 'month' } }),
      ]);

      const findPoints = (arr: any[], uid: number) => {
        const entry = arr.find((u: any) => u.user_id === uid);
        return entry?.challenge_points?? 0;
      };

      setStats({
        played: data.games_played ?? 0,
        daily: findPoints(dayRes.data, userId),
        weekly: findPoints(weekRes.data, userId),
        monthly: findPoints(monthRes.data, userId),
        created: data.challenges_created ?? 0,
        random: data.random_points ?? 0,
      });
    } catch (err) {
      console.error('Profile loadUser error:', err);
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
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isAuth ? (
          <View style={styles.card}>
            {(avatar || profileUri) && (
              <Image
                source={avatar ? avatarImages[avatar] : { uri: profileUri! }}
                style={styles.avatar}
              />
            )}

            <Text style={styles.cardTitle}>{userName}</Text>
            <Text style={styles.email}>{userEmail}</Text>

            <View style={styles.pointsGrid}>
              {pointCategories.map(category => (
                <View key={category} style={styles.pointCard}>
                  <Text style={styles.pointLabel}>{category}</Text>
                  <Text style={styles.pointValue}>
                    {stats[category.toLowerCase() as keyof Stats]}
                  </Text>
                </View>
              ))}
            </View>

            <PillButton
              title="Create Challenge"
              variant="inverse"
              onPress={() => navigation.navigate('CreateChallenge')}
            />
            <PillButton
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
            />
            <PillButton
              title="Log Out"
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
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  pointsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pointCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pointLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  pointValue: {
    fontSize: 20,
    color: '#333',
    fontWeight: '700',
  },
  bodyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
});