import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';

// Import your local audio files (make sure these paths match your assets folder)
import againMp3 from '../assets/music/again.mp3';
import hologramMp3 from '../assets/music/hologram.mp3';
import goldentimeMp3 from '../../assets/music/goldentime.mp3';
import rewriteMp3 from '../../assets/music/rewrite.mp3';
import rainMp3 from '../../assets/music/rain.mp3';

type SongChallenge = {
  src: any;           // local asset reference
  answers: string[];
  correctAnswer: string;
};

const challenge: SongChallenge[] = [
  {
    src: againMp3,
    answers: ['AGAIN', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'],
    correctAnswer: 'AGAIN',
  },
  {
    src: hologramMp3,
    answers: ['GOLDEN TIME', 'AGAIN', 'HOLOGRAM', 'RAIN'],
    correctAnswer: 'HOLOGRAM',
  },
  {
    src: goldentimeMp3,
    answers: ['REWRITE', 'HOLOGRAM', 'GOLDEN TIME', 'RAIN'],
    correctAnswer: 'GOLDEN TIME',
  },
  {
    src: rewriteMp3,
    answers: ['REWRITE', 'AGAIN', 'GOLDEN TIME', 'RAIN'],
    correctAnswer: 'REWRITE',
  },
  {
    src: rainMp3,
    answers: ['REWRITE', 'AGAIN', 'RAIN', 'GOLDEN TIME'],
    correctAnswer: 'RAIN',
  },
];

export default function Game() {
  const [index, setIndex] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const soundRef = useRef<Audio.Sound | null>(null);

  const song = challenge[index];

  // Clean up previous sound when index changes or on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [index]);

  const playSong = async () => {
    setFeedback('');
    setIsCounting(false);

    try {
      const { sound } = await Audio.Sound.createAsync(song.src, {
        shouldPlay: true,
      });
      soundRef.current = sound;

      // Delay showing answers until playback starts
      setTimeout(() => setIsCounting(true), 500);
    } catch (err) {
      console.warn('Audio error', err);
    }
  };

  const handleSelect = (answer: string) => {
    const correct = answer === song.correctAnswer;
    setFeedback(correct ? '✅ Correct!' : '❌ Try Again');
    setIsCounting(false);

    // After showing feedback, move to next challenge
    setTimeout(() => {
      const next = index + 1 < challenge.length ? index + 1 : 0;
      setIndex(next);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.screenText}>
          {feedback || (isCounting ? 'Choose an answer:' : '🎵 Tap Play')}
        </Text>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={playSong}>
        <Text style={styles.playText}>▶️ Play</Text>
      </TouchableOpacity>

      {isCounting && (
        <View style={styles.optionsContainer}>
          {song.answers.map((ans) => (
            <TouchableOpacity
              key={ans}
              style={[
                styles.option,
                feedback &&
                  (ans === song.correctAnswer
                    ? styles.correct
                    : ans !== song.correctAnswer && feedback.startsWith('❌')
                    ? styles.wrong
                    : null),
              ]}
              onPress={() => handleSelect(ans)}
            >
              <Text style={styles.optionText}>{ans}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!isCounting && feedback !== '' && (
        <ActivityIndicator style={styles.loader} size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    width: '100%',
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  screenText: {
    fontSize: 18,
    color: '#333',
  },
  playButton: {
    padding: 16,
    backgroundColor: '#4a90e2',
    borderRadius: 50,
    marginBottom: 20,
  },
  playText: {
    fontSize: 24,
    color: '#fff',
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  correct: {
    backgroundColor: '#c6f6d5',
  },
  wrong: {
    backgroundColor: '#fed7d7',
  },
  loader: {
    marginTop: 20,
  },
});
