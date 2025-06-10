import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const GENRES = [
  'eclético','pop','anime','sertanejo','mpb','rap/funk brasileiro','rap/hip hop',
  'reggaeton','rock','dance','alternativo','samba/pagode','electro','música religiosa',
  'axé/forró','folk','reggae','jazz','clássica','metal','soul & funk','blues','cumbia',
  'música africana','música indiana','música asiática','r&b'
];

type ChallengeSet = { id: string; name: string; genre: string };

export default function SearchScreen({ navigation }: any) {
  const [genre, setGenre] = useState<string | null>(null);
  const [sets, setSets] = useState<ChallengeSet[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<string> | null>(null);

  useEffect(() => {
    if (genre) fetchSets(genre);
    else setSets([]);
  }, [genre]);

  const fetchSets = async (g: string) => {
    setLoading(true);
    try {
      const res = await axios.get<ChallengeSet[]>(`${API_BASE_URL}/challenge_sets/`);
      const filtered = res.data.filter(
        (s) => (s.genre || '').toLowerCase() === g.toLowerCase()
      );
      setSets(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderGenreItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      key={item}
      style={[styles.genreButton, genre === item && styles.genreActive]}
      onPress={() => setGenre(item)}
    >
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.carouselRow}>
          <FlatList
            ref={listRef}
            data={GENRES}
            keyExtractor={(item) => item}
            renderItem={renderGenreItem}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color="#4B73E5" />
          ) : (
            <FlatList
              data={sets}
              keyExtractor={(item) => item.id}
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
                  <Ionicons name="chevron-forward-outline" size={24} color="#4B73E5" />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={<Text style={styles.empty}>No challenges.</Text>}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 15, paddingBottom: 20 },

  carouselRow: {
    flex: 2,
    marginBottom: 12,
  },

  genreButton: {
    width: '100%',
    backgroundColor: '#E8F0FE',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  genreActive: { backgroundColor: '#9FB9F9' },

  genreText: { fontSize: 16, fontWeight: '600', color: '#333' },

  card: {
    flex: 3,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

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