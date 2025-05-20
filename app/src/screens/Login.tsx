import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      await AsyncStorage.setItem('token', res.data.token);
      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert(
        'Login failed',
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Songspert</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log In" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  title:     { fontSize:24, marginBottom:20, textAlign:'center' },
  input:     {
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    marginBottom:15,
    borderRadius:5,
  },
});
