import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  status: string;
  price: number;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        customerName: data.customerName ?? '',
        serviceName: data.serviceName ?? '',
        barberName: data.barberName ?? '',
        date:
          typeof data.date === 'string'
            ? data.date
            : data.date?.toDate?.().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }) ?? '',
        time:
          typeof data.time === 'string'
            ? data.time
            : data.time?.toDate?.().toLocaleTimeString('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
              }) ?? '',
        status: data.status ?? 'pending',
        price: data.price ?? 0,
      };
    });
  } catch (error) {
    console.error('Error loading bookings:', error);
    throw error;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);

    await updateDoc(bookingRef, {
      status,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}