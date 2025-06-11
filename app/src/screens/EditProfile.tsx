import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import {
  avatarNames,
  AvatarName,
} from '../../assets/images/avatar';
import AvatarSelector from '../components/AvatarSelector';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState({
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    daily_points: 0,
    weekly_points: 0,
    monthly_points: 0,
    profile_picture: "",
    completed_challenges: [],
    challenge_points: 0,
    random_points: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarName | null>(null);

  function isAvatarName(x: any): x is AvatarName {
    return typeof x === 'string' && avatarNames.includes(x as AvatarName);
  }

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        // set basic fields
        setUser(data)
        setName(data.username);
        setEmail(data.email);

        // determine avatar: prefer local storage, else server
        let pic: string | null = null;
        const stored = await AsyncStorage.getItem('avatar');
        if (stored && isAvatarName(stored)) {
          pic = stored;
        } else {
          const apiPic =
            (data.avatar as string) ??
            (data.avatar_url as string) ??
            (data.profile_picture as string) ??
            null;
          if (apiPic && isAvatarName(apiPic)) pic = apiPic;
        }

        if (pic) setSelectedAvatar(pic as AvatarName);
      } catch (e) {
        console.log('EditProfile load error', e);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const payload: any = {};
      if (name) payload.username = name;
      if (email) payload.email = email;
      if (password) payload.password = password;
      if (selectedAvatar) {
        payload.avatar = selectedAvatar;
        await AsyncStorage.setItem('avatar', selectedAvatar);
      }
      let data = {
        username: name,
        email: email,
        password: password,
        first_name: user.first_name,
        last_name: user.last_name,
        daily_points: user.daily_points,
        weekly_points: user.weekly_points,
        monthly_points: user.monthly_points,
        profile_picture: selectedAvatar
      }
      await axios.put(
        `${API_BASE_URL}/users/${user.id}/`,
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (e) {
      console.log('EditProfile save error', e);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit Profile</Text>

          <AvatarSelector
            selectedAvatar={selectedAvatar}
            onSelectAvatar={setSelectedAvatar}
            placeholderSize={100}
            iconSize={50}

          />

          <TextInput
            style={styles.input}
            placeholder="New Username"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="New Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  card: {
    backgroundColor: '#83A3F2',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#9fbaf9',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
