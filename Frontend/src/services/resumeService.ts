import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Resume';

// Response Type Definition
export interface EvaluationResult {
  score: number;
  summary: string;
  keywords: string[];
  improvements: string[];
}

export const uploadResume = async (file: File): Promise<EvaluationResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');

  const response = await axios.post<EvaluationResult>(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};