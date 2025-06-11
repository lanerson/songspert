import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export interface RandomAttempt {
  track: number;
  score: number;
  tips_used: number;
}

async function getRefreshToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem('token');
  return token
}

export async function getToken(): Promise<string | undefined> {
  const refreshToken = await getRefreshToken();
  console.log("refresh ", refreshToken)
  if (!refreshToken) return;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      { refresh: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const accessToken = response.data?.access;
    console.log("oi accessToken ", accessToken)
    if (accessToken) {
      return accessToken;
    } else {
      console.warn('Access token não encontrado na resposta.');
      return undefined;
    }

  } catch (err) {
    console.log('getToken falhou', err);
    await await AsyncStorage.removeItem('token');
    return undefined;
  }
}

export async function postRandomAttempt(data: RandomAttempt): Promise<void> {
  const token = await getToken();
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
  const token = await getToken();
  if (!token) return;
  try {
    await axios.post(`${API_BASE_URL}/attempts/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error('postChallengeAttempt failed', err);
  }
}