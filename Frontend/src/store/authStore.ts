import { create } from 'zustand';

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
  signUp: (user: Omit<User, 'role' | 'status'>) => { success: boolean; message: string };
  signIn: (credentials: Pick<User, 'email' | 'password'>) => { success: boolean; message: string };
  toggleUserStatus: (email: string) => void;
  updateAdminCredentials: (newEmail: string, newPassword: string) => { success: boolean; message: string };
  logout: () => void;
}

// Keeping only the System Admin as the default database segment
const defaultUsers: User[] = [
  { name: 'System Admin', email: 'admin@domain.com', password: 'admin123', role: 'Admin', status: 'Active' }
];

const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem('app_users');
  if (!stored) {
    localStorage.setItem('app_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  registeredUsers: getStoredUsers(),

  signUp: (newUser) => {
    const { registeredUsers } = get();
    const userExists = registeredUsers.some((u) => u.email === newUser.email);
    
    if (userExists) {
      return { success: false, message: "Identity record already registered." };
    }

    const createdUser: User = { ...newUser, role: 'User', status: 'Active' };
    const updatedUsers = [...registeredUsers, createdUser];
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    set({ registeredUsers: updatedUsers });
    return { success: true, message: "Profile registered successfully. Proceed to login." };
  },

  signIn: (credentials) => {
    const currentDatabase = getStoredUsers();
    const user = currentDatabase.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    if (user.status === 'Banned') {
      return { success: false, message: "Access denied. This profile environment is currently suspended." };
    }

    set({ isLoggedIn: true, currentUser: user, registeredUsers: currentDatabase });
    return { success: true, message: "Authentication verified." };
  },

  toggleUserStatus: (email) => {
    const { registeredUsers } = get();
    const updated = registeredUsers.map((user) => {
      if (user.email === email && user.role !== 'Admin') {
        return { ...user, status: user.status === 'Active' ? 'Banned' : ('Active' as const) };
      }
      return user;
    });
    localStorage.setItem('app_users', JSON.stringify(updated));
    set({ registeredUsers: updated });
  },

  updateAdminCredentials: (newEmail, newPassword) => {
    const { registeredUsers, currentUser } = get();
    if (!currentUser || currentUser.role !== 'Admin') {
      return { success: false, message: "Unauthorized action." };
    }

    const emailExists = registeredUsers.some((u) => u.email === newEmail && u.role !== 'Admin');
    if (emailExists) {
      return { success: false, message: "Target email is already claimed by another node." };
    }

    const updatedUsers = registeredUsers.map((user) => {
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

  logout: () => set({ isLoggedIn: false, currentUser: null }),
}));