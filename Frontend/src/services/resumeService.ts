import axios from 'axios';
import { CategoryScore } from '../types/resume';

const API_URL = 'http://localhost:5293/api/Resume';

// Response Type Definition
export interface EvaluationResult {
  score: number;
  summary: string;
  keywords: string[];
  improvements: string[];
  categoryScores?: CategoryScore[];
  missingSkills?: string[];
}

// jobDescription অপশনাল প্যারামিটার হিসেবে যুক্ত করা হলো
export const uploadResume = async (file: File, jobDescription?: string): Promise<EvaluationResult> => {
  const formData = new FormData();
  formData.append('file', file);

  // যদি জব ডেসক্রিপশন দেওয়া থাকে, তবে সেটি ফর্ম-ডাটার সাথে যুক্ত হবে
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  // localStorage অথবা authStore থেকে টোকেন নেওয়া
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post<EvaluationResult>(`${API_URL}/upload`, formData, {
    headers,
  });

  return response.data;
};