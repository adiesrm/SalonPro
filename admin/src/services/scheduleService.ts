import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface ScheduleBooking {
  id: string;
  customerName: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

type BookingData = Record<string, unknown>;

const VALID_STATUSES: AppointmentStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
];

function getText(value: unknown, fallback = ''): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function getNestedText(
  value: unknown,
  keys: string[],
  fallback = ''
): string {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const data = value as BookingData;

  for (const key of keys) {
    const text = getText(data[key], '');
    if (text) {
      return text;
    }
  }

  return fallback;
}

function normalizeStatus(value: unknown): AppointmentStatus {
  const status = getText(value, 'pending').toLowerCase();
  const normalized = status === 'canceled' ? 'cancelled' : status;

  if (VALID_STATUSES.includes(normalized as AppointmentStatus)) {
    return normalized as AppointmentStatus;
  }

  return 'pending';
}

function getMinutesFromTime(time: string): number {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  const [, hourText, minuteText, meridiem] = match;
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const normalizedHour =
    meridiem.toUpperCase() === 'PM' && hour !== 12
      ? hour + 12
      : meridiem.toUpperCase() === 'AM' && hour === 12
        ? 0
        : hour;

  return normalizedHour * 60 + minute;
}

function mapScheduleBooking(id: string, data: BookingData): ScheduleBooking {
  const customerName =
    getNestedText(data.customer, ['name', 'full_name', 'fullName']) ||
    getText(data.customerName) ||
    getText(data.customer_name) ||
    'Unknown Customer';

  const serviceName =
    getNestedText(data.service, ['name', 'title']) ||
    getText(data.serviceName) ||
    getText(data.service_name) ||
    'Service';

  const barberName =
    getNestedText(data.barber, ['name', 'full_name', 'fullName']) ||
    getText(data.barberName) ||
    getText(data.barber_name) ||
    'Unassigned';

  return {
    id,
    customerName,
    serviceName,
    barberName,
    date: getText(data.date),
    time: getText(data.time, 'Time not set'),
    status: normalizeStatus(data.status),
  };
}

export async function getBookingsByDate(
  date: string
): Promise<ScheduleBooking[]> {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('date', '==', date)
    );

    const snapshot = await getDocs(bookingsQuery);
    const bookings = snapshot.docs.map((docSnap) =>
      mapScheduleBooking(docSnap.id, docSnap.data())
    );

    return bookings.sort(
      (firstBooking, secondBooking) =>
        getMinutesFromTime(firstBooking.time) -
        getMinutesFromTime(secondBooking.time)
    );
  } catch (error) {
    console.error('Error loading schedule bookings:', error);
    throw error;
  }
}

export async function getTodayBookings(): Promise<ScheduleBooking[]> {
  return getBookingsByDate('Today');
}

export async function updateBookingStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  try {
    await updateDoc(doc(db, 'bookings', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
}
