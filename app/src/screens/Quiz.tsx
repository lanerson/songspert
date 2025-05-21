import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';

// 1️⃣ Import your audio assets
import againMp3      from '../../assets/music/again.mp3';
import hologramMp3   from '../../assets/music/hologram.mp3';
import goldentimeMp3 from '../../assets/music/goldentime.mp3';
import rewriteMp3    from '../../assets/music/rewrite.mp3';
import rainMp3       from '../../assets/music/rain.mp3';

type Question = {
  src: any;             // the imported audio file
  correct: string;      // the correct answer text
  choices: string[];    // multiple-choice options
};

// 2️⃣ Build your question bank
const quizData: Question[] = [
  {
    src: againMp3,
    correct: 'AGAIN',
    choices: ['AGAIN', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'],
  },
  {
    src: hologramMp3,
    correct: 'HOLOGRAM',
    choices: ['GOLDEN TIME', 'AGAIN', 'HOLOGRAM', 'RAIN'],
  },
  {
    src: goldentimeMp3,
    correct: 'GOLDEN TIME',
    choices: ['REWRITE', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'],
  },
  {
    src: rewriteMp3,
    correct: 'REWRITE',
    choices: ['REWRITE', 'AGAIN', 'GOLDEN TIME', 'RAIN'],
  },
  {
    src: rainMp3,
    correct: 'RAIN',
    choices: ['REWRITE', 'AGAIN', 'RAIN', 'GOLDEN TIME'],
  },
];

export default function QuizScreen() {
  const [index, setIndex]         = useState(0);
  const [score, setScore]         = useState(0);
  const [showChoices, setShow]    = useState(false);
  const [feedback, setFeedback]   = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const question = quizData[index];

  // clean up sound on unmount or question change
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [index]);

  // 3️⃣ Play the current question’s audio
  const playAudio = async () => {
    // reset feedback & hide choices until audio starts
    setFeedback(null);
    setShow(false);

    // unload any previous sound
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    try {
      const { sound } = await Audio.Sound.createAsync(question.src, {
        shouldPlay: true,
      });
      soundRef.current = sound;

      // show choices after a short delay
      setTimeout(() => setShow(true), 500);
    } catch (err) {
      Alert.alert('Playback Error', 'Could not play this track.');
      console.warn(err);
    }
  };

  // 4️⃣ Handle answer taps
  const handleAnswer = (choice: string) => {
    const correct = choice === question.correct;
    if (correct) setScore((s) => s + 1);
    setFeedback(correct ? '✅ Correct!' : '❌ Incorrect');
    setShow(false);

    // move to next question after a pause
    setTimeout(() => {
      setFeedback(null);
      const next = index + 1 < quizData.length ? index + 1 : 0;
      setIndex(next);
    }, 1200);
  };

  // 5️⃣ End-of-quiz summary
  if (index === 0 && score === quizData.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.header}>Quiz Complete!</Text>
        <Text style={styles.score}>Your score: {score}/{quizData.length}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Music Quiz</Text>
      <Text style={styles.score}>Score: {score}</Text>

      <View style={styles.playContainer}>
        <TouchableOpacity style={styles.playButton} onPress={playAudio}>
          <Text style={styles.playText}>▶️ Play</Text>
        </TouchableOpacity>
      </View>

      {feedback && <Text style={styles.feedback}>{feedback}</Text>}

      {showChoices && (
        <View style={styles.choices}>
          {question.choices.map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.choiceButton}
              onPress={() => handleAnswer(c)}
            >
              <Text style={styles.choiceText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, padding: 16, backgroundColor: '#fff' },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header:      { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  score:       { fontSize: 18, marginBottom: 20 },
  playContainer: { alignItems: 'center', marginBottom: 20 },
  playButton:  {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 50,
  },
  playText:    { fontSize: 24, color: '#fff' },
  feedback:    { fontSize: 20, textAlign: 'center', marginVertical: 10 },
  choices:     { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' },
  choiceButton: {
    width: '48%',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    alignItems: 'center',
  },
  choiceText:  { fontSize: 16 },
});
