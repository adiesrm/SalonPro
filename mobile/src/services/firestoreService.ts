import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";
interface BookingData {
  userId: string;
  customerName: string;
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
export async function createUserProfile(
  uid: string,
  fullName: string,
  email: string
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    uid,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    role: "customer",
    createdAt: serverTimestamp(),
  });
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
  await setDoc(
    doc(collection(db, "bookings")),
    {
      ...booking,
      createdAt: serverTimestamp(),
    }
  );
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