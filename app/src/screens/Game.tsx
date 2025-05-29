import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { useRoute } from '@react-navigation/native';

type Challenge = {
  id: number;
  preview: string;        // Deezer preview URL from your serializer
  answers: string[];      // array of strings
  correct_answer: string; // name of correct answer
};

export default function GameScreen() {
  const route = useRoute<any>();
  const { setId, setName } = route.params;

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [index, setIndex]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [feedback, setFeedback]     = useState<string>('');
  const [showAnswers, setShow]      = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    fetchChallenges();
    // cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await axios.get<Challenge[]>(
        `${API_BASE_URL}/challenge_sets/${setId}/challenges/`,
        { headers }
      );
      setChallenges(res.data);
    } catch (err) {
      console.error('fetchChallenges failed', err);
    } finally {
      setLoading(false);
    }
  };

  const playPreview = async () => {
    setFeedback('');
    setShow(false);
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: challenges[index].preview },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setTimeout(() => setShow(true), 500);
    } catch (err) {
      console.warn('Audio error', err);
    }
  };

  const selectAnswer = (ans: string) => {
    const correct = ans === challenges[index].correct_answer;
    setFeedback(correct ? '✅ Correct!' : '❌ Try Again');
    setShow(false);

    setTimeout(() => {
      const next = index + 1 < challenges.length ? index + 1 : 0;
      setIndex(next);
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!challenges.length) {
    return (
      <View style={styles.center}>
        <Text>No challenges found in “{setName}.”</Text>
      </View>
    );
  }

  const song = challenges[index];

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{setName}</Text>

      <View style={styles.screen}>
        <Text style={styles.screenText}>
          {feedback ||
            (showAnswers ? 'Choose an answer:' : '▶️ Tap Play')}
        </Text>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={playPreview}>
        <Text style={styles.playText}>Play</Text>
      </TouchableOpacity>

      {showAnswers && (
        <View style={styles.options}>
          {song.answers.map((ans) => (
            <TouchableOpacity
              key={ans}
              style={[
                styles.option,
                feedback &&
                  (ans === song.correct_answer
                    ? styles.correct
                    : feedback.startsWith('❌')
                    ? styles.wrong
                    : null),
              ]}
              onPress={() => selectAnswer(ans)}
            >
              <Text style={styles.optionText}>{ans}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!showAnswers && feedback !== '' && (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerText:  { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screen:      {
    width: '100%',
    padding: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  screenText:  { fontSize: 18, color: '#333' },
  playButton:  {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  playText:    { fontSize: 18, color: '#fff' },
  options:     {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option:      {
    width: '48%',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    alignItems: 'center',
  },
  optionText:  { fontSize: 16 },
  correct:     { backgroundColor: '#c6f6d5' },
  wrong:       { backgroundColor: '#fed7d7' },
});
