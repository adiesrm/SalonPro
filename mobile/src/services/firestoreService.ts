import {
  createCustomer,
  getCustomerByPhone,
  incrementCustomerBookings,
} from './customerService';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
export interface BookingData {
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
}
export async function createUserProfile(
  uid: string,
  fullName: string,
  email: string,
  phone: string
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    uid,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: "customer",
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userSnapshot = await getDoc(doc(db, 'users', uid));

  if (!userSnapshot.exists()) {
    return null;
  }

  const data = userSnapshot.data();

  return {
    uid,
    fullName: String(data.fullName ?? '').trim(),
    email: String(data.email ?? '').trim().toLowerCase(),
    phone: String(data.phone ?? '').trim(),
  };
}
export async function getServices() {
  const servicesRef = collection(db, "services");

  const q = query(
    servicesRef,
    where("isActive", "==", true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
export async function getBarbers() {
  const barbersRef = collection(db, "barbers");

  const q = query(
    barbersRef,
    where("isActive", "==", true)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
export async function createBooking(booking: BookingData) {
  const existingCustomer = await getCustomerByPhone(booking.phone);

  await setDoc(
    doc(collection(db, "bookings")),
    {
      ...booking,
      createdAt: serverTimestamp(),
    }
  );

  if (existingCustomer) {
    await incrementCustomerBookings(existingCustomer.id);
    return;
  }

  await createCustomer({
    fullName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
  });
}
  export async function getUserBookings(userId: string) {
  const bookingsRef = collection(db, "bookings");

  const q = query(
    bookingsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
