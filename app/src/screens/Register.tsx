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
import { API_BASE_URL } from '../config/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  
  // Essa funciona: (lanito)
  // const handleRegister = async () => {
  //   console.log("Registering")
  //   try {
  //     await axios.post(`${API_BASE_URL}/users/`, {
  //       username:name,
  //       email:email,
  //       password:password,
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   );
    const handleRegister = async () => {
      try {
        await axios.post(`${API_BASE_URL}/users/`, {
          username:name,
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
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
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
      <Button title="Sign Up" onPress={handleRegister} />
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
