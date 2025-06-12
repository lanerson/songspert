import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import { avatarImages, AvatarName } from '../../assets/images/avatar';
import { getToken } from '../services/api';

type Entry = { id: string; name: string; score: number, profile_picture: AvatarName, first_name: string, last_name: string };
const filters = ['Daily', 'Weekly', 'Monthly', 'Random'];

export default function RankingScreen({ route }: any) {
  const [selected, setSelected] = useState<string>(filters[0]);
  const [ranking, setRanking] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRanking = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/`);
      const mapped = (res.data as any[]).map((u, idx) => ({
        id: u.id,
        name: u.username,
        score: u.random_points || 0,
        first_name: u.first_name,
        last_name: u.last_name,
        profile_picture: u.profile_picture as AvatarName
      }));
      if (selected !== 'Random') {
        const token = await getToken();
        const periodMap: Record<string, 'day' | 'week' | 'month'> = {
          Daily: 'day',
          Weekly: 'week',
          Monthly: 'month',
        };
        const period = periodMap[selected];
        const other_points = await axios.get(`${API_BASE_URL}/ranking`, {
          params: { period },
          headers: { Authorization: `Bearer ${token}` },
        });

        const rankingData = other_points.data as any[];

        const scoreMap = new Map<number, number>(
          rankingData.map(user => [user.user_id, user.challenge_points || 0])
        );
        mapped.forEach(user => (
          user.score = scoreMap.get(user.id)
        ));
      }
      setRanking(mapped.sort((a, b) => b.score - a.score));
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
          {filters.map(f => (
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

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={ranking}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item, index }) => (
                <View style={styles.rankRow}>
                  <Text style={styles.playerRank}>{index + 1}</Text>
                  <Image
                    source={avatarImages[item.profile_picture]}
                    style={styles.avatar}
                  />
                  <View style={styles.columnName}>
                    <Text style={styles.username}>{item.name}</Text>
                    <Text style={styles.playerName}>{`${item.first_name} ${item.last_name}`}</Text>
                  </View>

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
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#4B73E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
  },
  filterRow: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 14,
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
    paddingHorizontal: 6,
    gap: 10, // Se estiver usando React Native 0.71+, senão use marginRight individualmente
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
    fontWeight: '600',
  },
  username: {
    width: 60,
    fontSize: 16,
    color: '#333',
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  columnName: {
    flex: 1, // Ocupa o espaço restante
    justifyContent: 'center',
  },
  playerRank: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginRight: 6
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
