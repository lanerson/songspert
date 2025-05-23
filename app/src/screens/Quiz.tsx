import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';

// 1️⃣ Audio assets
import againMp3      from '../../assets/music/again.mp3';
import hologramMp3   from '../../assets/music/hologram.mp3';
import goldentimeMp3 from '../../assets/music/goldentime.mp3';
import rewriteMp3    from '../../assets/music/rewrite.mp3';
import rainMp3       from '../../assets/music/rain.mp3';

type Question = { src: any; correct: string; choices: string[]; };
const quizData: Question[] = [
  { src: againMp3,      correct: 'AGAIN',       choices: ['AGAIN','HOLOGRAM','GOLDEN TIME','RAIN'] },
  { src: hologramMp3,   correct: 'HOLOGRAM',    choices: ['GOLDEN TIME','AGAIN','HOLOGRAM','RAIN'] },
  { src: goldentimeMp3, correct: 'GOLDEN TIME', choices: ['REWRITE','HOLOGRAM','GOLDEN TIME','RAIN'] },
  { src: rewriteMp3,    correct: 'REWRITE',     choices: ['REWRITE','AGAIN','GOLDEN TIME','RAIN'] },
  { src: rainMp3,       correct: 'RAIN',        choices: ['REWRITE','AGAIN','RAIN','GOLDEN TIME'] },
];

export default function QuizScreen() {
  const [index, setIndex]       = useState(0);
  const [score, setScore]       = useState(0);
  const [showChoices, setShow]  = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const question = quizData[index];

  // play-button animation
  const scale = useRef(new Animated.Value(1)).current;
  const onPlayPress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1,   useNativeDriver: true }),
    ]).start();
    playAudio();
  };

  useEffect(() => () => {
    soundRef.current?.unloadAsync();
  }, [index]);

  const playAudio = async () => {
    setFeedback(null);
    setShow(false);
    if (soundRef.current) await soundRef.current.unloadAsync();
    try {
      setLoading(true);
      const { sound } = await Audio.Sound.createAsync(question.src, { shouldPlay: true });
      soundRef.current = sound;
      setTimeout(() => {
        setShow(true);
        setLoading(false);
      }, 500);
    } catch {
      setLoading(false);
    }
  };

  const handleAnswer = (choice: string) => {
    const correct = choice === question.correct;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? '✅ CORRECT!' : '❌ TRY AGAIN');
    setShow(false);
    setTimeout(() => {
      setFeedback(null);
      setIndex(i => (i + 1) % quizData.length);
    }, 1200);
  };

  // final summary
  if (index === 0 && score === quizData.length) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#678bec','#4B73E5']} style={styles.header}>
          <Text style={styles.headerText}>Songspert</Text>
        </LinearGradient>
        <View style={[styles.content, styles.center]}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quiz Complete!</Text>
            <Text style={styles.cardSubtitle}>
              Your score: {score}/{quizData.length}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* centered body */}
      <View style={[styles.content, styles.center]}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Music Quiz</Text>
          <Text style={styles.cardSubtitle}>Score: {score}</Text>

          <Progress.Bar
            progress={(index + 1) / quizData.length}
            width={null}
            height={8}
            color="#9fbaf9"
            unfilledColor="rgba(255,255,255,0.3)"
            borderWidth={0}
            style={{ marginBottom: 16, borderRadius: 4 }}
          />

          <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity style={styles.playButton} onPress={onPlayPress}>
              {loading
                ? <ActivityIndicator color="#FFF"/>
                : <Text style={styles.playText}>▶️ Play</Text>
              }
            </TouchableOpacity>
          </Animated.View>

          {feedback && <Text style={styles.feedback}>{feedback}</Text>}

          {showChoices && (
            <View style={styles.grid}>
              {question.choices.map(c => (
                <Pressable
                  key={c}
                  style={({ pressed }) => [
                    styles.choice,
                    feedback && c === question.correct && styles.correctChoice,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => handleAnswer(c)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      feedback && c === question.correct && styles.correctText,
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#4B73E5' },
  header:     { padding: 16, alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content:    {
    flex:             1,
    paddingHorizontal:16,
    justifyContent:   'center',  // center vertically
  },
  center:     { justifyContent: 'center' },

  card:       {
    backgroundColor: '#83A3F2',
    borderRadius:    8,
    padding:         20,
    shadowColor:     '#000',
    shadowOpacity:   0.1,
    shadowRadius:    4,
    elevation:       2,
    alignItems:      'center',
  },
  cardTitle:  { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 6 },
  cardSubtitle:{ fontSize: 16, color: '#fff', marginBottom: 12 },

  playButton: {
    backgroundColor: '#9fbaf9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius:    25,
    alignItems:      'center',
    marginBottom:    12,
  },
  playText:   { color: '#fff', fontSize: 18, fontWeight: '600' },

  feedback:   { color: '#fff', fontSize: 16, marginBottom: 12 },

  grid:       {
    flexDirection:  'row',
    flexWrap:      'wrap',
    justifyContent:'space-between',
  },
  choice:     {
    width:            '48%',
    backgroundColor: '#9fbaf9',
    paddingVertical: 16,
    borderRadius:    25,
    marginBottom:    12,
    alignItems:      'center',
  },
  choiceText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  correctChoice: { backgroundColor: '#CFD8FE' },
  correctText:   { color: '#5C79F2' },
});
