import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_BASE_URL } from '../config/api';
import { useFocusEffect } from '@react-navigation/native';
import PillButton from '../components/Buttons';

const { width } = Dimensions.get('window');
const GENRES = [
  'eclético',
    'pop',
    'anime',
    'sertanejo',
    'mpb',
    'rap/funk brasileiro',
    'rap/hip hop',
    'reggaeton',
    'rock',
    'dance',
    'alternativo',
    'samba/pagode',
    'electro',
    'música religiosa',
    'axé/forró',
    'folk',
    'reggae',
    'jazz',
    'clássica',
    'metal',
    'soul & funk',
    'blues',
    'cumbia',
    'música africana',
    'música indiana',
    'música asiática',
    'r&b',
];

type Song = { id: string; title: string; artist: string; preview?: string };

export default function CreateChallengeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [selected, setSelected] = useState<Song[]>([]);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState<string>(GENRES[0]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound) {
          sound.stopAsync(); 
        }
      };
    }, [sound])
  );

  const searchSongs = async (text: string) => {
    setQuery(text);
    if (!text.trim()) return setResults([]);
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
    } catch {
      // silent
    }
  };

  const addSong = (song: Song) => {
    if (!selected.some(s => s.id === song.id)) {
      setSelected(curr => [...curr, song]);
    }
    setQuery('');
    setResults([]);
  };

  const removeSong = (id: string) => {
    setSelected(curr => curr.filter(s => s.id !== id));
    if (playingId === id) sound?.stopAsync().then(() => setPlayingId(null));
  };

  const togglePlay = async (song: Song) => {
    if (playingId === song.id) {
      await sound?.pauseAsync();
      return setPlayingId(null);
    }
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.preview! });
    setSound(newSound);
    setPlayingId(song.id);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate(status => {
      if (status.isLoaded && status.didJustFinish) {
        newSound.unloadAsync();
        setPlayingId(null);
      }
    });
  };

  const handleCreate = async () => {
    if (selected.length < 4) {
      return alert('Please select at least 4 songs');
    }
    const titles = selected.map(s => s.title);
    const shuffle = (arr: any[]) => arr.sort(() => 0.5 - Math.random());
    const challenges = selected.map(s => {
      const falseOpts = shuffle(
        titles.filter(t => t !== s.title),
      ).slice(0, 3);
      return {
        track: parseInt(s.id),
        type: 'title',
        false_options: [...falseOpts, s.title].sort(() => 0.5 - Math.random()),
      };
    });

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/challenge_sets/`,
        { name, genre, category: 'title', challenges },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Challenge created!');
      navigation.goBack();
    } catch (err: any) {
      alert(err.response?.data?.detail || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.section}>
          <Text style={styles.label}>Challenge Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name your challenge"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Select Genre</Text>
          <FlatList
            horizontal
            data={GENRES}
            keyExtractor={item => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setGenre(item)}
                style={[styles.genrePill, genre === item && styles.genreActive]}
              >
                <Text style={[styles.genreText, genre === item && styles.genreTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Search Songs</Text>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#555" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={query}
              onChangeText={searchSongs}
            />
          </View>
          {results.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.resultItem}
              onPress={() => addSong(item)}
            >
              <Text style={styles.resultText} numberOfLines={1}>
                {item.title} - {item.artist}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Selected Songs</Text>
            {selected.map(item => (
              <View style={styles.selectedItem} key={item.id}>
                <Text style={styles.selectedTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.selectedActions}>
                  <TouchableOpacity onPress={() => togglePlay(item)}>
                    <MaterialIcons
                      name={playingId === item.id ? 'pause' : 'play-arrow'}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeSong(item.id)}>
                    <MaterialIcons name="delete" size={24} color="#E55D5D" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <PillButton
        title='Create Challenge'
        onPress={handleCreate}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  content: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#fff' },
  input: {
    backgroundColor: '#fff', borderRadius: 20, padding: 12,
    fontSize: 16, color: '#333'
  },
  genrePill: {
    backgroundColor: '#E8F0FE', borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 8, marginRight: 8,
  },
  genreActive: { backgroundColor: '#9fbaf9' },
  genreText: { fontSize: 14, color: '#333' },
  genreTextActive: { color: '#fff', fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 12, height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
  resultItem: {
    backgroundColor: '#fff', padding: 12,
    borderRadius: 8, marginTop: 8,
  },
  resultText: { color: '#333' },
  selectedItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#6C8AED',
    padding: 12, borderRadius: 2, marginTop: 8
  },
  selectedTitle: { flex: 1, marginRight: 12, fontSize: 15, color: '#fff' },
  selectedActions: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: '#9fbaf9', borderRadius: 8,
    paddingVertical: 16, alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});