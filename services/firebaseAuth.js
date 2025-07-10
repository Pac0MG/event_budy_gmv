
import { auth } from '../firebaseConfig';

export const signup = async (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const login = async (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const logout = async () => {
  return auth.signOut();
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

