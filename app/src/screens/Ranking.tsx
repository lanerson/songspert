import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Entry = { id: string; name: string; score: number; };
const mockRanking: Entry[] = [
  { id: '1', name: 'Alice', score: 120 },
  { id: '2', name: 'Bob',   score: 115 },
  { id: '3', name: 'Carol', score: 110 },
  { id: '4', name: 'David', score: 105 },
  { id: '5', name: 'Eve',   score: 100 },
  { id: '6', name: 'Frank', score: 95 },
  { id: '7', name: 'Grace', score: 90 },
  { id: '8', name: 'Heidi', score: 85 },
  { id: '9', name: 'Ivan',  score: 80 },
  { id: '10', name: 'Judy', score: 75 },
];

const filters = ['Daily', 'Weekly', 'Monthly', 'Annually', 'All Time'];

export default function RankingScreen() {
  const [selected, setSelected] = useState(filters[0]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ——— Pill-shaped Filter Row ——— */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow} 
          style={styles.filterContainer}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                selected === f && styles.filterBtnActive,
              ]}
              onPress={() => setSelected(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  selected === f && styles.filterTextActive,
                ]}
              >
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ——— Ranking Card ——— */}
        <View style={styles.card}>
          <FlatList
            data={mockRanking}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item, index }) => (
              <View style={styles.rankRow}>
                <View style={styles.avatar}>
                  <Text style={styles.rankNum}>{index + 1}</Text>
                </View>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerScore}>{item.score}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    height: 48,               // same as filterBtn height
    maxHeight: 48,
    marginBottom:16      // clip any content outside 48px
  },
  container: { 
    flex: 1, 
    backgroundColor: '#4B73E5' 
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
  },

  filterRow: {
    // space below pills before the card
    marginBottom: 0,
    alignItems: 'center'
  },
  filterBtn: {
    height: 48,              // same as search bar
    borderRadius: 24,        // half the height
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#9fbaf9',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B73E5',
  },
  filterTextActive: {
    color: '#fff',
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

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9fbaf9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  separator: { 
    height: 1, 
    backgroundColor: '#eee' 
  },
});
