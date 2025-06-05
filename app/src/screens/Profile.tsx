// ProfileScreen.tsx
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

export default function ProfileScreen({ navigation }: any) {
  const [avatar, setAvatar] = useState<AvatarName | null>(null);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [userName, setUserName] = useState('Arthur Bragança');
  const [userEmail, setUserEmail] = useState('arthur@example.com');
  const [stats, setStats] = useState({ played: 42, highScore: 128, daily: 5, weekly: 20, monthly: 100, created: 10 });

  const loadUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        highScore: res.data.high_score,
        daily: res.data.daily_score,
        weekly: res.data.weekly_score,
        monthly: res.data.monthly_score,
        created: res.data.challenges_created,
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  const onEditPhoto = () => {
    // implement photo picker
    console.log('Change photo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={onEditPhoto}>
            <Image
              source={avatar ? avatarImages[avatar] : { uri: profileUri || undefined }}
              style={styles.avatar}
            />
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.cardTitle}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.played}</Text>
              <Text style={styles.statLabel}>Played</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.highScore}</Text>
              <Text style={styles.statLabel}>High Score</Text>
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={handleLogout}
          >
            <Text style={styles.linkText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4B73E5',
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
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
});
