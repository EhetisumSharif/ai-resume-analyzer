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
  // JSON.parse-এর পর explicit cast করা হয়েছে
  return JSON.parse(stored) as User[];
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  currentUser: null,
  registeredUsers: getStoredUsers(),

  signUp: (newUser) => {
    const { registeredUsers } = get();
    const userExists = registeredUsers.some((u) => u.email === newUser.email);
    
    if (userExists) {
      return { success: false, message: "This email is already registered." };
    }

    const createdUser: User = { ...newUser, role: 'User', status: 'Active' };
    const updatedUsers: User[] = [...registeredUsers, createdUser];
    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    
    set({ registeredUsers: updatedUsers });
    return { success: true, message: "Account created! You can now log in." };
  },

  signIn: (credentials) => {
    const currentDatabase = getStoredUsers();
    const user = currentDatabase.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return { success: false, message: "Incorrect email or password." };
    }

    if (user.status === 'Banned') {
      return { success: false, message: "Your account has been suspended." };
    }

    set({ isLoggedIn: true, currentUser: user, registeredUsers: currentDatabase });
    return { success: true, message: "Login successful." };
  },

  toggleUserStatus: (email) => {
    const { registeredUsers } = get();
    const updated: User[] = registeredUsers.map((user) => {
      if (user.email === email && user.role !== 'Admin') {
        const newStatus: 'Active' | 'Banned' = user.status === 'Active' ? 'Banned' : 'Active';
        return { ...user, status: newStatus };
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
    
    return { success: true, message: "Your login details have been updated." };
  },

  logout: () => set({ isLoggedIn: false, currentUser: null }),
}));