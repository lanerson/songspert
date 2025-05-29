import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/`, {
        username: name,
        email,
        password,
      });
      Alert.alert('Success', 'Account created! Please log in.');
      navigation.replace('Login');
    } catch (err: any) {
      Alert.alert(
        'Registration failed',
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        err.message
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />


          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.linkText}>
              Already have an account? Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },

  header: {
    padding: 16,
    backgroundColor: '#678bec',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#83A3F2',
    borderRadius: 8,
    padding: 20,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
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

  linkContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
