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
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

type ChallengeSet = { id: string; name: string; created_at: string; challenges: any[] };

export default function HomeScreen({ navigation }: any) {
  const [sets, setSets] = useState<ChallengeSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSets(); }, []);

  const fetchSets = async () => {
    try {
      const res = await axios.get<ChallengeSet[]>(`${API_BASE_URL}/challenge_sets/`);
      setSets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#4B73E5', '#4B73E5']}
        style={styles.header}
      >
        <Text style={styles.headerText}>Songspert</Text>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.card}>
          {/* Initial Quiz */}
          <TouchableOpacity
            style={styles.pillButton}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.pillText}>Initial Quiz</Text>
          </TouchableOpacity>

          {/* List or Loading */}
          {loading ? (
            <ActivityIndicator size="large" color="#4B73E5" style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={sets}
              keyExtractor={(item) => item.id}
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() =>
                    navigation.navigate('Game', {
                      setId: item.id,
                      setName: item.name,
                    })
                  }
                >
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color="#4B73E5"
                  />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <Text style={styles.empty}>No challenge sets.</Text>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  header: { padding: 16, alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
  },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  pillButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pillText: { color: '#4B73E5', fontSize: 16, fontWeight: '600' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  separator: { height: 1, backgroundColor: '#eee' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});