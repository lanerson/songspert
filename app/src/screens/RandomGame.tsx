import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { Audio } from 'expo-av';
import { API_BASE_URL } from '../config/api';
import { useFocusEffect } from '@react-navigation/native';
import { postRandomAttempt } from '../services/api';
import { calcPoints } from '../utils/points';
import tvImg from '../../assets/images/tv.png';

type Question = {
  id: number;
  rank: number;
  preview: string;
  answers: string[];
  correct: string;
};

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

export default function RandomGameScreen() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showAnswers, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    pickRandom();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (soundRef.current) {
          soundRef.current.stopAsync();
          setIsPlaying(false);
        }
      };
    }, [])
  );

  const pickRandom = async () => {
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    setLoading(true);
    setFeedback('');
    setShow(false);
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      setIsPlaying(false);
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/genre/list/`, {
        params: { name: genre, n: 4 },
      });
      const data = res.data.data.map((item: any) => ({
        id: item.id,
        title: item.title.split(' (')[0],
        preview: item.preview,
        rank: item.rank,
      }));
      const correct = data[0];
      const answers = [...data.map((d: any) => d.title)];
      answers.sort(() => Math.random() - 0.5);
      setQuestion({ id: correct.id, preview: correct.preview, rank: correct.rank, answers, correct: correct.title });
    } catch (err) {
      console.error('Failed to fetch random song', err);
    } finally {
      setLoading(false);
    }
  };

  const playPreview = async () => {
    if (!question) return;
    setFeedback('');
    setShow(false);
    if (soundRef.current) await soundRef.current.unloadAsync();
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: question.preview },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) setIsPlaying(false);
        }
      });
      setIsPlaying(true);
      setTimeout(() => setShow(true), 500);
    } catch (err) {
      console.warn('audio error', err);
    }
  };

  const togglePlayback = async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if ('isLoaded' in status && status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    }
  };

  const selectAnswer = async (ans: string) => {
    if (!question) return;
    const correct = ans === question.correct;
    setFeedback(correct ? 'CORRECT!' : 'TRY AGAIN');
    if (correct) {
      setScore(s => s + 1);
      const points = calcPoints(question.rank);
      console.log({ track: question.id, score: points, tips_used: 0 });
      await postRandomAttempt({ track: question.id, score: points, tips_used: 0 });
    }
    setCount(c => c + 1);
    setShow(false);
    if (soundRef.current) {
      soundRef.current.stopAsync();
      setIsPlaying(false);
    }
    setTimeout(() => pickRandom(), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Random Game</Text>
        <LinearGradient colors={['#FFD54F', '#FFA000']} style={styles.scoreBadge}>
          <FontAwesome5 name="trophy" size={20} color="#FFF" />
          <Text style={styles.scoreBadgeText}>{score} / {count}</Text>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <View style={styles.tvContainer}>
          <ImageBackground source={tvImg} style={styles.tvBackground} resizeMode="contain">
            <View
              style={[
                styles.screenOverlay,
                feedback === 'CORRECT!' && styles.feedbackCorrect,
                feedback === 'TRY AGAIN' && styles.feedbackWrong,
              ]}
            >
              {!feedback ? (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={isPlaying ? togglePlayback : playPreview}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Ionicons
                      name={isPlaying ? 'stop' : 'play'}
                      size={32}
                      color="#FFF"
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <Text style={styles.feedbackText}>{feedback}</Text>
              )}
            </View>
          </ImageBackground>
        </View>

        {showAnswers && question && (
          <View style={styles.options}>
            {question.answers.map((ans, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  feedback &&
                  (ans === question.correct
                    ? styles.correct
                    : feedback === 'TRY AGAIN'
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4B73E5' },
  header: { paddingVertical: 24, alignItems: 'center' },
  headerText: { color: '#FFF', fontSize: 28, fontWeight: '700', marginBottom: 12 },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    elevation: 4,
  },
  scoreBadgeText: { color: '#FFF', fontSize: 18, fontWeight: '700', marginLeft: 8 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  tvContainer: { alignItems: 'center', marginBottom: 16 },
  tvBackground: { width: '100%', aspectRatio: 4 / 3 },
  screenOverlay: { position: 'absolute', top: '35%', left: '21%', width: '48.5%', height: '40%', backgroundColor: '#FFF', borderRadius: 2, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  feedbackCorrect: { backgroundColor: 'rgba(76,175,80,0.85)' },
  feedbackWrong: { backgroundColor: 'rgba(244,67,54,0.85)' },
  playButton: { backgroundColor: '#4B73E5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  feedbackText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  options: { marginTop: 10, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  option: { width: '100%', backgroundColor: '#E8F0FE', paddingVertical: 14, borderRadius: 25, marginBottom: 8, justifyContent: 'center', alignItems: 'center', elevation: 2, marginTop: 6 },
  optionText: { fontSize: 16, fontWeight: '600', color: '#333' },
  correct: { backgroundColor: '#c6f6d5' },
  wrong: { backgroundColor: '#fed7d7' },
});