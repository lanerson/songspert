import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '../config/api';
import tvImg from '../../assets/images/tv.png';

type Challenge = {
  id: number;
  preview: string;
  answers: string[];
  correct: string;
};

export default function GameScreen() {
  const route = useRoute<any>();
  const { setId, setName } = route.params;

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    fetchChallenges();
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const shuffle = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);

  const fetchChallenges = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/challenge_sets/${setId}/`);
      const fetched = await Promise.all(
        res.data.challenges.map(async (ch: any) => {
          const t = await axios.get(`${API_BASE_URL}/track/${ch.track}/`);
          return {
            id: ch.id,
            preview: t.data.preview,
            answers: shuffle([...ch.false_options]),
            correct: ch.correct_answer,
          } as Challenge;
        })
      );
      setChallenges(fetched);
    } catch (err) {
      console.error('fetchChallenges failed', err);
    } finally {
      setLoading(false);
    }
  };


  const playAudio = async () => {
    setFeedback(null);
    setShowChoices(false);
    if (soundRef.current) await soundRef.current.unloadAsync();
    try {
      setAudioLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: challenges[index].preview },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setTimeout(() => {
        setShowChoices(true);
        setAudioLoading(false);
      }, 500);
    } catch (err) {
      setAudioLoading(false);
      console.warn('Audio error', err);
    }
  };

  const handleAnswer = (ans: string) => {
    const correct = ans === challenges[index].correct;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'CORRECT!' : 'TRY AGAIN');
    setShowChoices(false);
    setTimeout(() => {
      if (index === challenges.length - 1) setFinished(true);
      else setIndex(i => i + 1);
      setFeedback(null);
    }, 1200);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!challenges.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={{ color: '#fff' }}>No challenges found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = index / challenges.length;
  const question = challenges[index];


  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{setName}</Text>
          <LinearGradient colors={['#FFD54F', '#FFA000']} style={styles.scoreBadge}>
            <FontAwesome5 name="trophy" size={20} color="#FFF" />
            <Text style={styles.scoreBadgeText}>{score} / {challenges.length}</Text>
          </LinearGradient>
        </View>
        <View style={styles.center}>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{setName}</Text>
        <LinearGradient colors={['#FFD54F', '#FFA000']} style={styles.scoreBadge}>
          <FontAwesome5 name="trophy" size={20} color="#FFF" />
          <Text style={styles.scoreBadgeText}>{score} / {challenges.length}</Text>
        </LinearGradient>
      </View>


      <View style={styles.content}>
        <View style={styles.tvContainer}>
          <ImageBackground source={tvImg} style={styles.tvBackground} resizeMode="contain">
            <View style={[
              styles.screenOverlay,
              feedback === 'CORRECT!' && styles.feedbackCorrect,
              feedback === 'TRY AGAIN' && styles.feedbackWrong,
            ]}>
              {!feedback ? (
                <TouchableOpacity style={styles.playButton} onPress={playAudio}>
                  {audioLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Ionicons name="play" size={32} color="#FFF" />
                  )}
                </TouchableOpacity>
              ) : (
                <Text style={styles.feedbackText}>{feedback}</Text>
              )}
            </View>
          </ImageBackground>
        </View>

        <Progress.Bar
          progress={progress}
          width={null}
          color="#FFF"
          unfilledColor="rgba(255,255,255,0.3)"
          borderWidth={0}
          style={styles.progress}
        />
        {showChoices && !feedback && (
          <View style={styles.choicesContainer}>
            {question.answers.map(c => (
              <TouchableOpacity key={c} onPress={() => handleAnswer(c)} style={styles.choiceButton}>
                <Text style={styles.choiceText}>{c}</Text>
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
  headerText: { color: '#FFF', fontSize: 24, fontWeight: '700', marginBottom: 8 },
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
  screenOverlay: {
    position: 'absolute',
    top: '35%',
    left: '21%',
    width: '48.5%',
    height: '40%',
    backgroundColor: '#FFF',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  feedbackCorrect: { backgroundColor: 'rgba(76,175,80,0.85)' },
  feedbackWrong: { backgroundColor: 'rgba(244,67,54,0.85)' },
  playButton: { backgroundColor: '#4B73E5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  feedbackText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  progress: { marginVertical: 16, height: 8, borderRadius: 4 },
  choicesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  choiceButton: { width: '100%', backgroundColor: '#E8F0FE', paddingVertical: 14, borderRadius: 25, marginBottom: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  choiceText: { fontSize: 16, fontWeight: '600', color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  restartButton: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, elevation: 2 },
  restartText: { color: '#333', fontSize: 16, fontWeight: '600' },
});