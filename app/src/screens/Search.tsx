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
  'mistureba','pop','anime','sertanejo','mpb','rap/funk brasileiro','rap/hip hop',
  'reggaeton','rock','dance','alternativo','samba/pagode','electro','música religiosa',
  'axé/forró','folk','reggae','jazz','clássica','metal','soul & funk','blues','cumbia',
  'música africana','música indiana','música asiática','r&b',
];


type ChallengeSet = { id: string; name: string; genre: string };

export default function SearchScreen({ navigation }: any) {
  const [genre, setGenre] = useState<string | null>(null);
  const [sets, setSets] = useState<ChallengeSet[]>([]);
  const [loading, setLoading] = useState(false);
  const pages = Array.from({ length: Math.ceil(GENRES.length / 12) }, (_, i) =>
    GENRES.slice(i * 12, i * 12 + 12)
  );
  const [pageIndex, setPageIndex] = useState(0);
  const listRef = useRef<FlatList<string[]>>(null);

  useEffect(() => {
    if (genre) fetchSets(genre); else setSets([]);
  }, [genre]);

  const fetchSets = async (g: string) => {
    setLoading(true);
    try {
      const res = await axios.get<ChallengeSet[]>(`${API_BASE_URL}/challenge_sets/`);
      const filtered = res.data.filter(s => (s.genre || '').toLowerCase() === g.toLowerCase());
      setSets(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePage = (next: boolean) => {
    const newIdx = (pageIndex + (next ? 1 : -1) + pages.length) % pages.length;
    setPageIndex(newIdx);
    listRef.current?.scrollToIndex({ index: newIdx, animated: true });
  };

  const renderGenrePage = ({ item }: { item: string[] }) => (
    <View style={styles.pageContainer}>
      {item.map(g => (
        <TouchableOpacity
          key={g}
          style={[styles.genreButton, genre === g && styles.genreActive]}
          onPress={() => setGenre(g)}
        >
          <Text style={styles.genreText}>{g}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.carouselRow}>
          <TouchableOpacity onPress={() => handlePage(false)} style={styles.arrow}> 
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <FlatList
            ref={listRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={pages}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderGenrePage}
          />
          <TouchableOpacity onPress={() => handlePage(true)} style={styles.arrow}>
            <Ionicons name="chevron-forward" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color="#4B73E5" />
          ) : (
            <FlatList
              data={sets}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => navigation.navigate('Game', { setId: item.id, setName: item.name })}
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
  carouselRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  pageContainer: { width: 260, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  genreButton: {
    width: '32%',
    backgroundColor: '#E8F0FE',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  genreActive: { backgroundColor: '#9fbaf9' },
  genreText: { color: '#333' },
  arrow: { paddingHorizontal: 8 },
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  separator: { height: 1, backgroundColor: '#eee' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});