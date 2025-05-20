import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

type Song = {
  id: string;
  title: string;
  artist?: string;
};

export default function HomeScreen({ navigation }: any) {
  const [songs, setSongs]     = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // guard: redirect to Login if no token
  useEffect(() => {
    AsyncStorage.getItem('token').then(token => {
      if (!token) navigation.replace('Login');
    });
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get<Song[]>(
        `${API_BASE_URL}/songs`
      );
      setSongs(res.data);
    } catch (err) {
      console.error('Failed to load songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Welcome to Songspert</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.songTitle}>{item.title}</Text>
              {item.artist && <Text style={styles.artist}>{item.artist}</Text>}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No songs found.</Text>
          }
        />
      )}

      <View style={styles.footer}>
        <Button title="Refresh" onPress={fetchSongs} />
        <Button title="Logout" onPress={handleLogout} color="#d33" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item:      { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  songTitle: { fontSize: 18 },
  artist:    { fontSize: 14, color: '#666' },
  empty:     { textAlign: 'center', marginTop: 32, color: '#999' },
  footer:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});
