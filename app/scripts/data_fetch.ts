import axios from 'axios';
import { API_BASE_URL } from '../src/config/api';
import { UserType } from '../src/models/user';

export async function getUsers(): Promise<UserType[]> {
  const res = await axios.get<UserType[]>(`${API_BASE_URL}/users/`);
  return res.data;
}