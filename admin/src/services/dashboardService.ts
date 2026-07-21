import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export interface DashboardStats {
  totalBookings: number;
  activeStaff: number;
  totalCustomers: number;
  upcomingAppointments: number;
}

export interface RecentBooking {
  id: string;
  name: string;
  service: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  avatarUrl: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const bookingsSnapshot = await getCountFromServer(
      collection(db, 'bookings')
    );

    const staffSnapshot = await getCountFromServer(
      collection(db, 'barbers')
    );

    const customersSnapshot = await getCountFromServer(
      collection(db, 'customers')
    );

    return {
      totalBookings: bookingsSnapshot.data().count,
      upcomingAppointments: bookingsSnapshot.data().count,
      activeStaff: staffSnapshot.data().count,
      totalCustomers: customersSnapshot.data().count,
    };
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    throw error;
  }
}

export async function getRecentBookings(): Promise<RecentBooking[]> {
  try {
    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.customerName,
        service: data.serviceName,
        time: data.time,
        status:
          (data.status.charAt(0).toUpperCase() +
            data.status.slice(1).toLowerCase()) as
            | 'Confirmed'
            | 'Pending'
            | 'Completed',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.customerName
        )}&background=E0E7FF&color=4F46E5`,
      };
    });
  } catch (error) {
    console.error('Error loading recent bookings:', error);
    throw error;
  }
}