import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { avatarNames, avatarImages, AvatarName } from '../../assets/images/avatar';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarName | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.username);
        setEmail(res.data.email);
        const pic = res.data.profile_picture || res.data.avatar_url;
        if (pic && avatarNames.includes(pic)) {
          setSelectedAvatar(pic as AvatarName);
        }
      } catch (e) {
        console.log(e);
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
      if (selectedAvatar) payload.profile_picture = selectedAvatar;
      await axios.patch(`${API_BASE_URL}/users/me/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.log(e);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.avatarsRow}>
            {avatarNames.map((a) => (
              <TouchableOpacity
                key={a}
                onPress={() => setSelectedAvatar(a as AvatarName)}
                style={[
                  styles.avatarOption,
                  selectedAvatar === a && styles.avatarSelected,
                ]}
              >
                <Image source={avatarImages[a as AvatarName]} style={styles.avatarImage} />
              </TouchableOpacity>
            ))}
          </View>

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
  content: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
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
  avatarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  avatarOption: {
    width: 96,
    height: 96,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 48,
    overflow: 'hidden',
  },
  avatarSelected: {
    borderColor: '#4B73E5',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
