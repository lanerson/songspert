import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Result = { id: string; name: string; artist: string };
const mockResults: Result[] = [
  { id: '1', name: 'Song One',   artist: 'Artist A' },
  { id: '2', name: 'Song Two',   artist: 'Artist B' },
  { id: '3', name: 'Song Three', artist: 'Artist C' },
  { id: '4', name: 'Song Four',  artist: 'Artist D' },
  { id: '5', name: 'Song Five',  artist: 'Artist E' },
  { id: '6', name: 'Song Six',   artist: 'Artist F' },
  { id: '7', name: 'Song Seven', artist: 'Artist G' },
  { id: '8', name: 'Song Eight', artist: 'Artist H' },
  { id: '9', name: 'Song Nine',  artist: 'Artist I' },
  { id: '10', name: 'Song Ten',  artist: 'Artist J' },
  { id: '11', name: 'Song Eleven', artist: 'Artist K' },
  { id: '12', name: 'Song Twelve', artist: 'Artist L' },
  { id: '13', name: 'Song Thirteen', artist: 'Artist M' },
  { id: '14', name: 'Song Fourteen', artist: 'Artist N' },
  { id: '15', name: 'Song Fifteen', artist: 'Artist O' },
];

export default function SearchScreen() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<Result[]>(mockResults);

  const handleSearch = (text: string) => {
    setQuery(text);
    setResults(
      mockResults.filter(r =>
        r.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>
        {/* ——— Pill-shaped Search Button ——— */}
        <View style={styles.searchPill}>
          <Ionicons name="search" size={20} color="#000000" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#000000"
            value={query}
            onChangeText={handleSearch}
          />
        </View>

        {/* ——— Results Card ——— */}
        <View style={styles.card}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row}>
                <View>
                  <Text style={styles.songName}>{item.name}</Text>
                  <Text style={styles.artist}>{item.artist}</Text>
                </View>
                <Ionicons
                  name="play-circle-outline"
                  size={28}
                  color="#4B73E5"
                />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.empty}>No results found.</Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },

  header: {
    padding:      16,
    alignItems:   'center',
  },
  headerText: {
    color:     '#fff',
    fontSize:  20,
    fontWeight:'bold',
  },

  content: {
    flex:              1,
    paddingHorizontal: 16,
    paddingTop:        15,
    paddingBottom:   20
  },

  searchPill: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FFFFFF',
    borderRadius:    24,
    height:          48,
    paddingHorizontal: 16,
    marginBottom:    16,
  },
  searchInput: {
    flex:       1,
    marginLeft: 8,
    fontSize:   16,
    color:      '#333',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius:    12,
    padding:         16,
    shadowColor:     '#000',
    shadowOpacity:   0.05,
    shadowRadius:    8,
    shadowOffset:    { width: 0, height: 4 },
    elevation:       3,
    flex:            1,
  },

  row: {
    flexDirection:   'row',
    justifyContent: 'space-between',
    alignItems:      'center',
    paddingVertical: 12,
  },
  songName: { fontSize: 16, fontWeight: '600', color: '#333' },
  artist:   { fontSize: 14, color: '#666', marginTop: 2 },
  separator:{ height: 1, backgroundColor: '#eee' },

  empty: {
    textAlign: 'center',
    color:     '#999',
    marginTop: 20,
  },
});
