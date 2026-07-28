import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../config/firebase';

const customersRef = collection(db, 'customers');

interface CreateCustomerData {
  fullName: string;
  phone: string;
  email: string;
}
export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  totalBookings: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastVisit?: unknown;
}

/**
 * Creates a new customer
 */
export async function createCustomer(data: CreateCustomerData): Promise<string> {
  try {
    const docRef = await addDoc(customersRef, {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,

      totalBookings: 0,
      isActive: true,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastVisit: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Finds a customer by phone number
 */
export async function getCustomerByPhone(phone: string) {
  try {
    const q = query(customersRef, where('phone', '==', phone));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error('Error finding customer:', error);
    throw error;
  }
}
/**
 * Returns all customers
 */
export async function getCustomers(): Promise<Customer[]> {
  try {
    const snapshot = await getDocs(customersRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Customer, 'id'>),
    }));
  } catch (error) {
    console.error('Error loading customers:', error);
    throw error;
  }
}