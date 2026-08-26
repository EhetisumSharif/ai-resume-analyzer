import { create } from 'zustand';
import axios from 'axios';

export interface User {
  name?: string;
  email: string;
  password?: string;
  role: 'User' | 'Admin';
  status: 'Active' | 'Banned';
}

interface AuthState {
  isLoggedIn: boolean;
  registeredUsers: User[];
  currentUser: User | null;
  signUp: (user: Omit<User, 'role' | 'status'>) => Promise<{ success: boolean; message: string }>;
  signIn: (credentials: Pick<User, 'email' | 'password'>) => Promise<{ success: boolean; message: string }>;
  toggleUserStatus: (email: string) => void;
  updateAdminCredentials: (newEmail: string, newPassword: string) => { success: boolean; message: string };
  logout: () => void;
}

const defaultUsers: User[] = [
  { name: 'System Admin', email: 'admin@domain.com', password: 'admin123', role: 'Admin', status: 'Active' }
];

const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem('app_users');
  if (!stored) {
    localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  // JSON.parse-এর পর explicit cast করা হয়েছে
  return JSON.parse(stored) as User[];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  registeredUsers: getStoredUsers(),

  signUp: async (newUser) => {
    try {
      const response = await axios.post('http://localhost:5293/api/Auth/register', {
        name: newUser.name || 'User',
        email: newUser.email,
        password: newUser.password
      });

      const { registeredUsers } = get();
      const createdUser: User = { ...newUser, role: 'User', status: 'Active' };
      const updatedUsers = [...registeredUsers, createdUser];
      localStorage.setItem('app_users', JSON.stringify(updatedUsers));

      set({ registeredUsers: updatedUsers });

      const successMsg = response.data.message || "Profile registered successfully. Proceed to login.";
      alert(successMsg); // 👈 এখানে সরাসরি পপ-আপ অ্যালার্ট চলে আসবে!

      return { success: true, message: successMsg };

    } catch (error: any) {
      const errorData = error.response?.data;
      let errMsg = "Registration failed.";

      if (typeof errorData === 'string') {
        errMsg = errorData;
      } else if (errorData?.message) {
        errMsg = errorData.message;
      } else if (Array.isArray(errorData)) {
        errMsg = errorData.map((err: any) => err.description).join(' ');
      } else {
        errMsg = "Password must be at least 6 characters and include uppercase, lowercase, and numbers.";
      }

      alert("Error: " + errMsg);
      return { success: false, message: errMsg };
    }
  },

  signIn: async (credentials) => {
    try {
      // ব্যাকএন্ডে রিয়েল লগইন এপিআই কল
      const response = await axios.post('http://localhost:5293/api/Auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      // ব্যাকএন্ড থেকে আসা আসল JWT টোকেন সেভ করা
      const token = response.data.token;
      localStorage.setItem('token', token);

      const currentDatabase = getStoredUsers();
      let user = currentDatabase.find((u) => u.email === credentials.email);

      if (!user) {
        const role = credentials.email === 'admin@domain.com' ? 'Admin' : 'User';
        user = { name: credentials.email.split('@')[0], email: credentials.email, role, status: 'Active' };
        const updatedUsers = [...currentDatabase, user];
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        set({ registeredUsers: updatedUsers });
      }

      if (user.status === 'Banned') {
        localStorage.removeItem('token');
        return { success: false, message: "Access denied. This profile environment is currently suspended." };
      }

      set({ isLoggedIn: true, currentUser: user, registeredUsers: currentDatabase });
      return { success: true, message: "Authentication verified." };

    } catch (error: any) {
      return { success: false, message: "Invalid email or password." };
    }
  },

  toggleUserStatus: (email) => {
    const { registeredUsers } = get();
    const updated: User[] = registeredUsers.map((user) => {
      if (user.email === email && user.role !== 'Admin') {
        return { ...user, status: user.status === 'Active' ? ('Banned' as const) : ('Active' as const) };
      }
      return user;
    });
    localStorage.setItem('app_users', JSON.stringify(updated));
    set({ registeredUsers: updated });
  },

  updateAdminCredentials: (newEmail, newPassword) => {
    const { registeredUsers, currentUser } = get();
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, message: "You don't have permission to do this." };
    }

    const emailExists = registeredUsers.some((u) => u.email === newEmail && u.role !== 'Admin');
    if (emailExists) {
      return { success: false, message: "This email is already in use." };
    }

    const updatedUsers: User[] = registeredUsers.map((user) => {
      if (user.role === 'Admin') {
        return { ...user, email: newEmail, password: newPassword };
      }
      return user;
    });

    localStorage.setItem('app_users', JSON.stringify(updatedUsers));

    const updatedAdmin: User = { ...currentUser, email: newEmail, password: newPassword };
    set({ registeredUsers: updatedUsers, currentUser: updatedAdmin });

    return { success: true, message: "Security credentials updated successfully." };
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isLoggedIn: false, currentUser: null });
  },
}));