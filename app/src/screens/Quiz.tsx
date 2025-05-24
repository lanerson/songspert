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

// 🎵 Audio assets
import againMp3      from '../../assets/music/again.mp3';
import hologramMp3   from '../../assets/music/hologram.mp3';
import goldentimeMp3 from '../../assets/music/goldentime.mp3';
import rewriteMp3    from '../../assets/music/rewrite.mp3';
import rainMp3       from '../../assets/music/rain.mp3';
import itMp3       from '../../assets/music/it.mp3';
import juMp3       from '../../assets/music/ju.mp3';
import loMp3    from '../../assets/music/lo.mp3';  
import taMp3      from '../../assets/music/ta.mp3';
import whMp3      from '../../assets/music/wh.mp3';
// 📺 TV image asset
import tvImg from '../../assets/images/tv.png';

type Question = { src: any; correct: string; choices: string[] };
const quizData: Question[] = [
  // { src: againMp3,      correct: 'AGAIN',       choices: ['AGAIN','HOLOGRAM','GOLDEN TIME','RAIN'] },
  // { src: hologramMp3,   correct: 'HOLOGRAM',    choices: ['GOLDEN TIME','AGAIN','HOLOGRAM','RAIN'] },
  // { src: goldentimeMp3, correct: 'GOLDEN TIME', choices: ['REWRITE','HOLOGRAM','GOLDEN TIME','RAIN'] },
  // { src: rewriteMp3,    correct: 'REWRITE',     choices: ['REWRITE','AGAIN','GOLDEN TIME','RAIN'] },
  // { src: rainMp3,       correct: 'RAIN',        choices: ['REWRITE','AGAIN','RAIN','GOLDEN TIME'] },
  {src: itMp3,      correct: 'It Will Rain',       choices: ['It Will Rain','Just the Way You Are','Locked Out Of Heaven','Talking To The Moon'] },
  { src: juMp3,   correct: 'Just the Way You Are',    choices: ['Locked Out Of Heaven','It Will Rain','Talking To The Moon','Just the Way You Are' ] },
  { src: loMp3, correct: 'Locked Out Of Heaven', choices: ['Talking To The Moon','Locked Out Of Heaven','When I Was Your Man','It Will Rain'] },
  { src: taMp3,    correct: 'Talking To The Moon',     choices: ['When I Was Your Man','Talking To The Moon','Just the Way You Are','It Will Rain'] },
  { src: whMp3,       correct: 'When I Was Your Man',        choices: ['When I Was Your Man','It Will Rain','Talking To The Moon','Just the Way You Are'] },
];

export default function QuizScreen() {
  const [index, setIndex]         = useState(0);
  const [score, setScore]         = useState(0);
  const [showChoices, setShow]    = useState(false);
  const [feedback, setFeedback]   = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [finished, setFinished]   = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const question = quizData[index];

  // play-button animation
  const scale = useRef(new Animated.Value(1)).current;
  const onPlayPress = () => {
    Animated.sequence([
      // Animated.spring(scale, { toValue: 1.2, useNativeDriver: true }),
      // Animated.spring(scale, { toValue: 1,   useNativeDriver: true }),
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
    setFeedback(correct ? 'CORRECT!' : 'TRY AGAIN');
    setShow(false);
    setTimeout(() => {
      setFeedback(null);
      if (index === quizData.length - 1) {
        setFinished(true);
      } else {
        setIndex(i => i + 1);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setScore(0);
    setIndex(0);
    setFeedback(null);
    setShow(false);
    setFinished(false);
  };

  // summary when finished
  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Quiz Complete!</Text>
          <Text style={styles.scoreText}>Score: {score}/{quizData.length}</Text>
        </View>
        <View style={styles.center}>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // main quiz screen
  const progress = (index) / quizData.length;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>First Quiz</Text>
        <Text style={styles.scoreText}>Score: {score}/{quizData.length}</Text>
      </View>

            <View style={styles.content}>
                  <Progress.Bar
                    progress={progress}
                    width={null}
                    color="#FFF"
                    unfilledColor="rgba(255,255,255,0.3)"
                    borderWidth={0}
                    style={styles.progress}
                  />

        {/* TV with white screen and feedback overlay */}
        <View style={styles.tvContainer}>
          <ImageBackground source={tvImg} style={styles.tvBackground} resizeMode="contain">
            <View style={styles.screenOverlay} />

            {/* Feedback overlay inside screen */}
            {feedback && (
              <View style={[
                styles.screenOverlay,
                feedback === 'CORRECT!' ? styles.feedbackCorrect : styles.feedbackWrong
              ]}>
                <Text style={styles.feedbackOverlayText}>{feedback}</Text>
              </View>
            )}

            {/* Play button */}
            {!feedback && (
              <Animated.View style={[styles.playWrapper, { transform: [{ scale }] }]}>            
                <TouchableOpacity style={styles.playButton} onPress={onPlayPress}>
                  {loading
                    ? <ActivityIndicator color="#4B73E5" />
                    : <Ionicons name="play" size={32} color="#4B73E5" />
                  }
                </TouchableOpacity>
              </Animated.View>
            )}
          </ImageBackground>
        </View>

        {/* Choices closer to TV */}
        {showChoices && !feedback && (
          <View style={styles.choicesContainer}>
            {question.choices.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => handleAnswer(c)}
                style={[styles.choiceButton]}
              >
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
  container:      { flex: 1, backgroundColor: '#4B73E5' },

  header:         {
    backgroundColor: '#4B73E5',
    padding: 20,
    alignItems: 'center'
  },
  headerText:     { color: '#FFF', fontSize: 24, fontWeight: '700' },
  scoreText:      { color: 'rgba(255,255,255,1)', fontSize: 30, marginTop: 40 },

  content:        { flex: 1, padding: 20 },
  progress:       { marginBottom: 16 },

  tvContainer:    { alignItems: 'center', marginBottom: 8 },
  tvBackground:   {
    width: '100%',
    aspectRatio: 4/3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenOverlay:  {
    position: 'absolute',
    top: '34.5%',
    left: '20.7%',
    width: '49%',
    height: '41%',
    backgroundColor: '#FFF',
    borderRadius: 2,
    zIndex: 1,
  },

  feedbackCorrect:{ backgroundColor: 'rgba(76,175,80,0.85)' },
  feedbackWrong:  { backgroundColor: 'rgba(244,67,54,0.85)' },
  feedbackOverlayText: { color: '#FFF', fontSize: 20, fontWeight: '700', top:43, left: 35 },

  playWrapper:    {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [ { translateX: -30 }, { translateY: -30 } ],
    zIndex: 2,
  },
  playButton:     {
    backgroundColor: '#E8F0FE',
    width:            60,
    height:           60,
    borderRadius:    30,
    bottom:            '25%',
    right:            '65%',
    justifyContent:  'center',
    alignItems:      'center',
    elevation:       3,
  },

  choicesContainer:{
    flexDirection: 'row',
    flexWrap:      'wrap',
    justifyContent:'space-between',
    marginTop:     4,
  },
  choiceButton:   {
    width:            '48%',
    backgroundColor: '#E8F0FE',
    paddingVertical: 16,
    borderRadius:    25,
    marginBottom:    12,
    justifyContent:  'center',
    alignItems:      'center',
    elevation:       2,
  },
  choiceText:     { fontSize: 16, fontWeight: '600', color: '#333' },

  center:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
  restartButton:  { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, elevation: 2 },
  restartText:    { color: '#333', fontSize: 16, fontWeight: '600' },
});
