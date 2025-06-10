import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useFocusEffect } from '@react-navigation/native';

type Entry = { id: string; name: string; score: number };

const filters = ['Daily', 'Weekly', 'Monthly'];

export default function RankingScreen() {
  const [selected, setSelected] = useState(filters[0]);
  const [ranking, setRanking] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/`);
      const data = res.data as any[];
      const field = `${selected.toLowerCase()}_points` as keyof typeof data[0];
      const mapped = data
        .map(u => ({
          id: String(u.id),
          name: u.username,
          score: u[field] || 0,
        }))
        .sort((a, b) => b.score - a.score);
      setRanking(mapped);
    } catch (err) {
      console.error('fetch ranking failed', err);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  useFocusEffect(
    useCallback(() => {
      fetchRanking();
    }, [fetchRanking])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
         {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={ranking}
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
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    height: 48,               
    maxHeight: 48,
    marginBottom:16      
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
    marginBottom: 0,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    height: 48,              
    borderRadius: 24,      
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
