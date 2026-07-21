import { Timestamp } from 'firebase/firestore';

export interface Customer {
  id: string;

  fullName: string;
  phone: string;
  email: string;

  totalBookings: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastVisit: Timestamp;

  isActive: boolean;
}