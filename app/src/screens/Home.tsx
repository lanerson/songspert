import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

type ChallengeSet = { id: string; name: string;created_at: string; challenges: any[]; };
// type Track = {id: string;
// title: string;   
// artist: string; //or whatever your view returns   
// preview: string;     // Deezer preview URL 
// };

export default function HomeScreen({ navigation }: any) {
  const [sets, setSets]       = useState<ChallengeSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSongs(); }, []);

  const fetchSongs = async () => {
    try {
    const res = await axios.get<ChallengeSet[]>(`${API_BASE_URL}/challenge_sets/`);
    console.log("API response:", JSON.stringify(res.data, null, 2)); //teste
    // const res = await axios.get<Track[]>(`${API_BASE_URL}/search/?q=pop`);
      setSets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ——— Header + Auth Buttons ——— */}
      <View style={styles.header}>
        <Text style={styles.title}>Songspert</Text>
        <View style={styles.authRow}>

          <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Quiz')}>
            <Text>Start Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.authText}>Sign Up</Text>
          </TouchableOpacity>
  
        </View>
      </View>

      {/* ——— Content ——— */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      ) : (
        <FlatList
          data={sets}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Game', {
                  setId:   item.id,
                  setName: item.name,
                })
              }
            >
              <View style={styles.card}>
                <Text style={styles.songTitle}>{item.name}</Text>
                <Text style={styles.artist}>
                  Created at{' '}
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No challenge sets.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    padding: 16,
    backgroundColor: '#282c34',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title:      { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  authRow:    { flexDirection: 'row' },
  authButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#61dafb',
  },
  authText:   { color: '#282c34', fontWeight: '600' },

  card:       {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    // shadow on iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation on Android
    elevation: 2,
  },
  songTitle:  { fontSize: 18, fontWeight: '500' },
  artist:     { fontSize: 14, color: '#555', marginTop: 4 },
  empty:      { textAlign: 'center', marginTop: 32, color: '#999' },
});
