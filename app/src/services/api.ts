import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export interface RandomAttempt {
  track: number;
  score: number;
  tips_used: number;
}

export async function postRandomAttempt(data: RandomAttempt): Promise<void> {
  const token = await AsyncStorage.getItem('token');
  if (!token) return;
  try {
    await axios.post(`${API_BASE_URL}/random_attempts/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error('postRandomAttempt failed', err);
  }
}

export interface ChallengeAttempt {
  challenge_set: number;
  score: number;
  is_correct: number;
}

export async function postChallengeAttempt(data: ChallengeAttempt): Promise<void> {
  const token = await AsyncStorage.getItem('token');
  if (!token) return;
  try {
    await axios.post(`${API_BASE_URL}/attempts/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error('postChallengeAttempt failed', err);
  }
}