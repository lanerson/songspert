import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Challenge = { id: string; name: string; };

const allChallenges: Challenge[] = [
  { id: '1', name: 'Challenge A' },
  { id: '2', name: 'Challenge B' },
  { id: '3', name: 'Challenge C' },
  { id: '4', name: 'Challenge D' },
  { id: '5', name: 'Challenge E' },
];

export default function RandomGameScreen() {
  const [list, setList] = useState<Challenge[]>(allChallenges);

  const pickRandom = () => {
    const random = allChallenges[Math.floor(Math.random() * allChallenges.length)];
    setList([random]);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Centered Content */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.shuffleBtn} onPress={pickRandom}>
          <Ionicons name="shuffle-outline" size={20} color="#fff" />
          <Text style={styles.shuffleText}>Pick a Random Challenge</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.challengeName}>{item.name}</Text>
                <Ionicons name="play-circle-outline" size={28} color="#4B73E5" />
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
    justifyContent:    'center', // vertical center
    alignItems:        'center', // horizontal center
    paddingHorizontal: 16,
  },
  shuffleBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#9fbaf9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius:    24,
    marginBottom:    16,
  },
  shuffleText: {
    color:     '#fff',
    fontSize:  16,
    fontWeight:'600',
    marginLeft: 8,
  },
  card: {
    backgroundColor:  '#fff',
    borderRadius:     12,
    padding:          16,
    shadowColor:      '#000',
    shadowOpacity:    0.05,
    shadowRadius:     8,
    shadowOffset:     { width: 0, height: 4 },
    elevation:        3,
    width:            '100%',
  },
  row: {
    flexDirection:   'row',
    justifyContent: 'space-between',
    alignItems:      'center',
    paddingVertical: 12,
  },
  challengeName: {
    fontSize:   16,
    fontWeight: '600',
    color:      '#333',
  },
  separator: {
    height:           1,
    backgroundColor: '#eee',
  },
});