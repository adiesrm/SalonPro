import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

const barbersRef = collection(db, 'barbers');

export interface Barber {
  id: string;
  name: string;
  role: string;
  rating: string;
  description: string;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BarberFormValues {
  name: string;
  role: string;
  rating: string;
  description: string;
}

function mapBarber(id: string, data: Record<string, unknown>): Barber {
  return {
    id,
    name: String(data.name ?? ''),
    role: String(data.role ?? ''),
    rating: String(data.rating ?? ''),
    description: String(data.description ?? ''),
    isActive: data.isActive !== false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function getBarbers(): Promise<Barber[]> {
  try {
    const q = query(barbersRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      mapBarber(docSnap.id, docSnap.data())
    );
  } catch (error) {
    console.error('Error loading barbers:', error);
    throw error;
  }
}

export async function addBarber(data: BarberFormValues): Promise<string> {
  try {
    const docRef = await addDoc(barbersRef, {
      name: data.name.trim(),
      role: data.role.trim(),
      rating: data.rating.trim(),
      description: data.description.trim(),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding barber:', error);
    throw error;
  }
}

export async function updateBarber(
  barberId: string,
  data: BarberFormValues
): Promise<void> {
  try {
    await updateDoc(doc(db, 'barbers', barberId), {
      name: data.name.trim(),
      role: data.role.trim(),
      rating: data.rating.trim(),
      description: data.description.trim(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating barber:', error);
    throw error;
  }
}

export async function toggleBarberStatus(
  barberId: string,
  isActive: boolean
): Promise<void> {
  try {
    await updateDoc(doc(db, 'barbers', barberId), {
      isActive,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating barber status:', error);
    throw error;
  }
}
