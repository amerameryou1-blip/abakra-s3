import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

export { db, auth };

export interface ComplaintData {
  id: string;
  reason: string;
  note?: string;
  question: string;
  context?: string;
  lang?: 'ar' | 'en';
  createdAt: string;
  status?: 'pending' | 'reviewed' | 'resolved';
  userId?: string;
}

export interface ScoreData {
  id: string;
  categoryId: string;
  score: number;
  total: number;
  percentage?: number;
  createdAt: string;
  userId?: string;
}

export async function submitComplaintToFirestore(data: ComplaintData): Promise<void> {
  const path = `complaints/${data.id}`;
  try {
    const payload: Record<string, any> = {
      id: data.id,
      reason: data.reason,
      question: data.question,
      createdAt: data.createdAt,
      status: data.status || 'pending',
    };
    if (data.note) payload.note = data.note;
    if (data.context) payload.context = data.context;
    if (data.lang) payload.lang = data.lang;
    if (data.userId) payload.userId = data.userId;

    await setDoc(doc(db, 'complaints', data.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToComplaints(onUpdate: (complaints: ComplaintData[]) => void, onError?: (err: any) => void) {
  try {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const list: ComplaintData[] = snapshot.docs.map(doc => doc.data() as ComplaintData);
      onUpdate(list);
    }, (error) => {
      console.warn('Firestore complaints subscription note:', error?.message || error);
      if (onError) onError(error);
    });
  } catch (error) {
    console.warn('Firestore complaints subscription init error:', error);
    return () => {};
  }
}

export async function submitScoreToFirestore(data: ScoreData): Promise<void> {
  const path = `user_scores/${data.id}`;
  try {
    const payload: Record<string, any> = {
      id: data.id,
      categoryId: data.categoryId,
      score: data.score,
      total: data.total,
      percentage: data.percentage ?? Math.round((data.score / Math.max(1, data.total)) * 100),
      createdAt: data.createdAt,
    };
    if (data.userId) payload.userId = data.userId;

    await setDoc(doc(db, 'user_scores', data.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToScores(onUpdate: (scores: ScoreData[]) => void) {
  try {
    const q = query(collection(db, 'user_scores'), orderBy('createdAt', 'desc'), limit(30));
    return onSnapshot(q, (snapshot) => {
      const list: ScoreData[] = snapshot.docs.map(doc => doc.data() as ScoreData);
      onUpdate(list);
    }, (error) => {
      console.warn('Firestore scores subscription note:', error?.message || error);
    });
  } catch (error) {
    console.warn('Firestore scores subscription init error:', error);
    return () => {};
  }
}
