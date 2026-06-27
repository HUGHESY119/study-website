import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0018698579",
  appId: "1:801990357305:web:e59725136287228a3138e8",
  apiKey: "AIzaSyDR0wDUHEolqm4t033f18bDySjXYnwSrto",
  authDomain: "gen-lang-client-0018698579.firebaseapp.com",
  // Using default firestore database or custom if specified
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
