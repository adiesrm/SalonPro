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

const servicesRef = collection(db, 'services');

export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  rating: string;
  description: string;
  whatsIncluded: string[];
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ServiceFormValues {
  name: string;
  category: string;
  price: string;
  duration: string;
  rating: string;
  description: string;
  whatsIncludedText: string;
}

function parseIncludedItems(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapIncludedItems(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return parseIncludedItems(value);
  }

  return [];
}

function mapService(id: string, data: Record<string, unknown>): Service {
  return {
    id,
    name: String(data.name ?? ''),
    category: String(data.category ?? ''),
    price: String(data.price ?? ''),
    duration: String(data.duration ?? ''),
    rating: String(data.rating ?? ''),
    description: String(data.description ?? ''),
    whatsIncluded: mapIncludedItems(data.whatsIncluded),
    isActive: data.isActive !== false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function getServicePayload(data: ServiceFormValues) {
  return {
    name: data.name.trim(),
    category: data.category.trim(),
    price: data.price.trim(),
    duration: data.duration.trim(),
    rating: data.rating.trim(),
    description: data.description.trim(),
    whatsIncluded: parseIncludedItems(data.whatsIncludedText),
  };
}

export async function getServices(): Promise<Service[]> {
  try {
    const q = query(servicesRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) =>
      mapService(docSnap.id, docSnap.data())
    );
  } catch (error) {
    console.error('Error loading services:', error);
    throw error;
  }
}

export async function addService(data: ServiceFormValues): Promise<string> {
  try {
    const docRef = await addDoc(servicesRef, {
      ...getServicePayload(data),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
}

export async function updateService(
  serviceId: string,
  data: ServiceFormValues
): Promise<void> {
  try {
    await updateDoc(doc(db, 'services', serviceId), {
      ...getServicePayload(data),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

export async function toggleServiceStatus(
  serviceId: string,
  isActive: boolean
): Promise<void> {
  try {
    await updateDoc(doc(db, 'services', serviceId), {
      isActive,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
}
