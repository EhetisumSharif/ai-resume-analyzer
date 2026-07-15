import { create } from 'zustand';

interface User {
  name?: string;
  email: string;
  password?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  registeredUsers: User[];
  currentUser: User | null;
  signUp: (user: User) => { success: boolean; message: string };
  signIn: (credentials: User) => { success: boolean; message: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  registeredUsers: [],
  currentUser: null,

  signUp: (newUser) => {
    const { registeredUsers } = get();
    const userExists = registeredUsers.some((u) => u.email === newUser.email);
    
    if (userExists) {
      return { success: false, message: "Identity record already registered." };
    }

    set({ registeredUsers: [...registeredUsers, newUser] });
    return { success: true, message: "Profile registered successfully. Proceed to login." };
  },

  signIn: (credentials) => {
    const { registeredUsers } = get();
    const user = registeredUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      set({ isLoggedIn: true, currentUser: user });
      return { success: true, message: "Authentication verified." };
    }
    return { success: false, message: "Invalid credentials footprint." };
  },

  logout: () => set({ isLoggedIn: false, currentUser: null }),
}));