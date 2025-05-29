import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';

// 🎵 Audio assets
import itMp3   from '../../assets/music/it.mp3';
import juMp3   from '../../assets/music/ju.mp3';
import loMp3   from '../../assets/music/lo.mp3';
import taMp3   from '../../assets/music/ta.mp3';
import whMp3   from '../../assets/music/wh.mp3';

// 📺 TV image asset
import tvImg from '../../assets/images/tv.png';

type Question = { src: any; correct: string; choices: string[] };
const quizData: Question[] = [
  // { src: againMp3,      correct: 'AGAIN',       choices: ['AGAIN','HOLOGRAM','GOLDEN TIME','RAIN'] },
  // { src: hologramMp3,   correct: 'HOLOGRAM',    choices: ['GOLDEN TIME','AGAIN','HOLOGRAM','RAIN'] },
  // { src: goldentimeMp3, correct: 'GOLDEN TIME', choices: ['REWRITE','HOLOGRAM','GOLDEN TIME','RAIN'] },
  // { src: rewriteMp3,    correct: 'REWRITE',     choices: ['REWRITE','AGAIN','GOLDEN TIME','RAIN'] },
  // { src: rainMp3,       correct: 'RAIN',        choices: ['REWRITE','AGAIN','RAIN','GOLDEN TIME'] },
  { src: itMp3, correct: 'It Will Rain',        choices: ['It Will Rain','Just the Way You Are','Locked Out Of Heaven','Talking To The Moon'] },
  { src: juMp3, correct: 'Just the Way You Are', choices: ['Locked Out Of Heaven','It Will Rain','Talking To The Moon','Just the Way You Are'] },
  { src: loMp3, correct: 'Locked Out Of Heaven', choices: ['Talking To The Moon','Locked Out Of Heaven','When I Was Your Man','It Will Rain'] },
  { src: taMp3, correct: 'Talking To The Moon',   choices: ['When I Was Your Man','Talking To The Moon','Just the Way You Are','It Will Rain'] },
  { src: whMp3, correct: 'When I Was Your Man',   choices: ['When I Was Your Man','It Will Rain','Talking To The Moon','Just the Way You Are'] },
];

export default function QuizScreen() {
  const [index, setIndex]       = useState(0);
  const [score, setScore]       = useState(0);
  const [showChoices, setShow]  = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [finished, setFinished] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const question = quizData[index];

  useEffect(() => {
  // nothing to do on mount

  return () => {
    // call unloadAsync, but don’t return its promise
    if (soundRef.current) {
      soundRef.current.unloadAsync();
    }
  };
}, [index]);

  const playAudio = async () => {
    setFeedback(null);
    setShow(false);
    if (soundRef.current) await soundRef.current.unloadAsync();
    try {
      setLoading(true);
      const { sound } = await Audio.Sound.createAsync(question.src, { shouldPlay: true });
      soundRef.current = sound;
      setTimeout(() => { setShow(true); setLoading(false); }, 500);
    } catch { setLoading(false); }
  };

  const handleAnswer = (choice: string) => {
    const correct = choice === question.correct;
    if (correct) setScore(s => s + 1);
    setFeedback(correct ? 'CORRECT!' : 'TRY AGAIN');
    setShow(false);
    setTimeout(() => {
      setFeedback(null);
      if (index === quizData.length - 1) setFinished(true);
      else setIndex(i => i + 1);
    }, 1200);
  };

  const handleRestart = () => {
    setScore(0); setIndex(0); setFeedback(null); setShow(false); setFinished(false);
  };

  // Finished screen
  if (finished) return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Quiz Complete!</Text>
        <LinearGradient colors={['#FFD54F','#FFA000']} style={styles.scoreBadge}>
          <FontAwesome5 name="trophy" size={20} color="#FFF" />
          <Text style={styles.scoreBadgeText}>{score} / {quizData.length}</Text>
        </LinearGradient>
      </View>
      <View style={styles.center}>
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Main quiz screen
  const progress = (index) / quizData.length;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>First Quiz</Text>
        <LinearGradient colors={['#FFD54F','#FFA000']} style={styles.scoreBadge}>
          <FontAwesome5 name="trophy" size={20} color="#FFF" />
          <Text style={styles.scoreBadgeText}>{score} / {quizData.length}</Text>
        </LinearGradient>
      </View>
      <View style={styles.content}>
        <View style={styles.tvContainer}>
          <ImageBackground source={tvImg} style={styles.tvBackground} resizeMode="contain">
            <View style={[
              styles.screenOverlay,
              feedback === 'CORRECT!' && styles.feedbackCorrect,
              feedback === 'TRY AGAIN' && styles.feedbackWrong
            ]}>
              {!feedback ? (
                <TouchableOpacity style={styles.playButton} onPress={playAudio}>
                  {loading
                    ? <ActivityIndicator color="#FFF" />
                    : <Ionicons name="play" size={32} color="#FFF" />
                  }
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
            {question.choices.map(c => (
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
  container:     { flex: 1, backgroundColor: '#4B73E5' },
  header:        { paddingVertical: 24, alignItems: 'center' },
  headerText:    { color: '#FFF', fontSize: 28, fontWeight: '700', marginBottom: 12 },
  scoreBadge:    {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    elevation: 4,
  },
  scoreBadgeText:{ color: '#FFF', fontSize: 18, fontWeight: '700', marginLeft: 8 },
  content:       { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  tvContainer:   { alignItems: 'center', marginBottom: 16 },
  tvBackground:  { width: '100%', aspectRatio: 4/3 },
  screenOverlay: { position: 'absolute', top: '35%', left: '21%', width: '48.5%', height: '40%', backgroundColor: '#FFF', borderRadius: 2, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  feedbackCorrect:{ backgroundColor: 'rgba(76,175,80,0.85)' },
  feedbackWrong:  { backgroundColor: 'rgba(244,67,54,0.85)' },
  playButton:    { backgroundColor: '#4B73E5', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  feedbackText:  { color: '#FFF', fontSize: 20, fontWeight: '700' },
  progress:      { marginVertical: 16, height: 8, borderRadius: 4 },
  choicesContainer:{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  choiceButton:  { width: '48%', backgroundColor: '#E8F0FE', paddingVertical: 14, borderRadius: 25, marginBottom: 12, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  choiceText:    { fontSize: 16, fontWeight: '600', color: '#333' },
  center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  restartButton: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, elevation: 2 },
  restartText:   { color: '#333', fontSize: 16, fontWeight: '600' },
});
