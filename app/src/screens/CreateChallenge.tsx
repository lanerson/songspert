import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../config/api';

const GENRES = [
  'mistureba', 'pop', 'anime', 'sertanejo', 'mpb', 'rap/funk brasileiro',
  'rap/hip hop', 'reggaeton', 'rock', 'dance', 'alternativo', 'samba/pagode',
  'electro', 'música religiosa', 'axé/forró', 'folk', 'reggae', 'jazz',
  'clássica', 'metal', 'soul & funk', 'blues', 'cumbia', 'música africana',
  'música indiana', 'música asiática', 'r&b',
];

type Song = {
  id: string;
  title: string;
  artist: string;
  preview?: string;
};

export default function CreateChallengeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [selected, setSelected] = useState<Song[]>([]);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState<string>('mistureba');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const search = async (text: string) => {
    setQuery(text);
    if (text.trim() === '') { setResults([]); return; }
    try {
      const res = await axios.get(`${API_BASE_URL}/search/`, { params: { q: text } });
      const data = res.data?.data || [];
      setResults(
        data.slice(0, 5).map((item: any) => ({
          id: String(item.id),
          title: item.title_short.split(' (')[0],
          artist: item.artist.name,
          preview: item.preview,
        }))
      );
    } catch (e) {
      console.log(e);
    }
  };

  const addSong = (song: Song) => {
    if (!selected.find(s => s.id === song.id)) {
      setSelected([...selected, song]);
    }
    setQuery('');
    setResults([]);
  };

  const removeSong = (id: string) => {
    setSelected(selected.filter(s => s.id !== id));
    if (playingId === id && sound) {
      sound.stopAsync();
      setPlayingId(null);
    }
  };

  const shuffle = (arr: string[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const handleCreate = async () => {
    if (selected.length < 4) {
      Alert.alert('Select at least 4 songs');
      return;
    }
    const titles = selected.map(s => s.title);
    const challenges = selected.map(s => {
      let choices: string[] = [];
      while (choices.length < 3) {
        const c = titles[Math.floor(Math.random() * titles.length)];
        if (c !== s.title && !choices.includes(c)) choices.push(c);
      }
      choices.push(s.title);
      choices = shuffle(choices);
      return { track: parseInt(s.id), type: 'title', false_options: choices };
    });
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/challenge_sets/`,
        { name, genre, category: 'title', challenges },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Challenge created!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || err.message);
    }
  };

  const playSong = async (song: Song) => {
    try {
      if (playingId === song.id && sound) {
        await sound.pauseAsync();
        setPlayingId(null);
        return;
      }
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.preview! });
      setSound(newSound);
      setPlayingId(song.id);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate(status => {
        if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (err) {
      console.warn('Playback error', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Give a name to your challenge!</Text>
        <TextInput
          style={styles.input}
          placeholder="Challenge name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Select it's genre</Text>
        <FlatList
          horizontal
          data={GENRES}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setGenre(item)}
              style={[styles.genrePill, genre === item && styles.genreActive]}
            >
              <Text style={styles.genreText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.label}>Select the songs</Text>
        <TextInput
          style={styles.input}
          placeholder="Search song"
          value={query}
          onChangeText={search}
        />
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultRow}
              onPress={() => addSong(item)}
            >
              <Text>{item.title} - {item.artist}</Text>
            </TouchableOpacity>
          )}
        />

        {selected.length > 0 && <Text style={styles.label}>Selected Songs</Text>}
        <FlatList
          data={selected}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.selectedRow}>
              <Text style={{ flex: 1, color: '#fff' }}>{item.title}</Text>
              <TouchableOpacity onPress={() => playSong(item)} style={{ paddingHorizontal: 8 }}>
                <MaterialIcons
                  name={playingId === item.id ? 'pause' : 'play-arrow'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeSong(item.id)} style={{ paddingHorizontal: 8 }}>
                <MaterialIcons name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create Challenge</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  content: { flex: 1, padding: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  label: { color: '#fff', marginBottom: 8, fontWeight: '600' },
  genrePill: {
    backgroundColor: '#E8F0FE',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 6,
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
  },
  genreActive: { backgroundColor: '#9fbaf9' },
  genreText: { color: '#333', fontSize: 14 },
  resultRow: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  button: {
    backgroundColor: '#9fbaf9',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 100,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
