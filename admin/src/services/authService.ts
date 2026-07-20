import {
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";
 
/**
 * Signs in an existing admin user with email and password.
 * @param email - The admin's email address
 * @param password - The admin's password
 * @returns A promise that resolves to the UserCredential
 */
export async function login(email: string, password: string): Promise<UserCredential> {
  const cleanEmail = email.trim().toLowerCase();
  return signInWithEmailAndPassword(auth, cleanEmail, password);
}
 
/**
 * Signs out the current authenticated admin user.
 * @returns A promise that resolves when the user is signed out
 */
export async function logout(): Promise<void> {
  return signOut(auth);
}
 
/**
 * Gets the currently authenticated admin user.
 * @returns The current Firebase User object or null if no user is signed in
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
 