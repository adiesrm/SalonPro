import {
  collection,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  increment,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

interface CreateCustomerData {
  fullName: string;
  phone: string;
  email: string;
}

const normalizePhone = (phone: string) => phone.replace(/[\s-]/g, '');

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
    const phone = normalizePhone(data.phone);
    const existingCustomer = await getCustomerByPhone(phone);

    if (existingCustomer) {
      return existingCustomer.id;
    }

    const customerRef = doc(db, 'customers', phone);

    await setDoc(customerRef, {
      fullName: data.fullName,
      phone,
      email: data.email,
      totalBookings: 1,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastVisit: serverTimestamp(),
    });

    return customerRef.id;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Records a completed booking against an existing customer.
 */
export async function incrementCustomerBookings(customerId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'customers', customerId), {
      totalBookings: increment(1),
      lastVisit: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error incrementing customer bookings:', error);
    throw error;
  }
}

/**
 * Finds a customer by phone number
 */
export async function getCustomerByPhone(phone: string) {
  try {
    const normalizedPhone = normalizePhone(phone);
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('phone', '==', normalizedPhone));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];

    return {
      id: docSnap.id,
      ...docSnap.data(),
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
    const customersRef = collection(db, 'customers');
    const snapshot = await getDocs(customersRef);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Customer, 'id'>),
    }));
  } catch (error) {
    console.error('Error loading customers:', error);
    throw error;
  }
}
