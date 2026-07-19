import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
signOut,
updateProfile,
User,
UserCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";
/**
Signs in an existing user with email and password.
@param email - The user's email address
@param password - The user's password
@returns A promise that resolves to the UserCredential
*/
export async function login(email: string, password: string): Promise<UserCredential> {
const cleanEmail = email.trim().toLowerCase();
return signInWithEmailAndPassword(auth, cleanEmail, password);
}
/**
Registers a new user with full name, email, and password.
After creating the account, it updates the user's profile with the provided full name.
@param fullName - The user's full name
@param email - The user's email address
@param password - The user's password
@returns A promise that resolves to the UserCredential
*/
export async function register(
fullName: string,
email: string,
password: string
): Promise<UserCredential> {
const cleanEmail = email.trim().toLowerCase();
const cleanFullName = fullName.trim();
const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
if (userCredential.user) {
await updateProfile(userCredential.user, {
displayName: cleanFullName,
});
}
return userCredential;
}
/**
Signs out the current authenticated user.
@returns A promise that resolves when the user is signed out
*/
export async function logout(): Promise<void> {
return signOut(auth);
}
/**
Gets the currently authenticated user.
@returns The current Firebase User object or null if no user is signed in
*/
export function getCurrentUser(): User | null {
return auth.currentUser;
}