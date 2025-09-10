import { auth } from "../../Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const AuthService = {
  login: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    localStorage.setItem("isLoggedIn", "true");

    return userCredential.user;
  },

  register: async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    localStorage.setItem("isLoggedIn", "true");

    return userCredential.user;
  },

  logout: async () => {
    localStorage.removeItem("isLoggedIn");

    await signOut(auth);
  },
};
