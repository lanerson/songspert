import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '../services/api';

export default function HomeScreen({ navigation }: any) {

  async function handleCreate() {
    let verify = await getToken()
    if (!verify) {
      navigation.navigate('Login')
    } else {
      navigation.navigate('CreateChallenge')
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Songspert</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Game', { setId: '11', setName: 'Bullet For My Valentine' })}
        >
          <Ionicons name="star-outline" size={48} />
          <Text style={styles.cardTitle}>Challenge of the Week</Text>
          <Text style={styles.cardDesc}>Play the Bullet For My Valentine's Challenge</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={handleCreate}
        >
          <Ionicons name="create-outline" size={48} />
          <Text style={styles.cardTitle}>Create Challenge</Text>
          <Text style={styles.cardDesc}>Design your own music quiz</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Ranking')}
        >
          <Ionicons name="trophy-outline" size={48} />
          <Text style={styles.cardTitle}>Ranking</Text>
          <Text style={styles.cardDesc}>View the leaderboard</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('RandomGame')}
        >
          <Ionicons name="play-circle-outline" size={48} />
          <Text style={styles.cardTitle}>Random Game</Text>
          <Text style={styles.cardDesc}>Jump into a surprise quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B73E5',
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 10,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
  },
});
