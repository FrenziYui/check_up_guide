import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const useFirebaseAuth = () => {
  const { $firebaseAuth } = useNuxtApp();
  const error = ref<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword($firebaseAuth, email, password);
      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await signOut($firebaseAuth);
      return true;
    } catch (err) {
      error.value = (err as Error).message;
      return false;
    }
  };

  return {
    login,
    logout,
    error,
  };
};
