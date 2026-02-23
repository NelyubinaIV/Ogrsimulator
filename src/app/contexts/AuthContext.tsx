import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Мок пользователей (3 кабинета)
const MOCK_USERS: User[] = [
  { id: '1', username: 'ivanov_petr', password: 'student2024', role: 'student', name: 'Иванов Петр Сергеевич' },
  { id: '2', username: 'smirnova_anna', password: 'student2024', role: 'student', name: 'Смирнова Анна Владимировна' },
  { id: '3', username: 'kuznetsov_dmitry', password: 'student2024', role: 'student', name: 'Кузнецов Дмитрий Александрович' },
  { id: '4', username: 'petrova_maria', password: 'student2024', role: 'student', name: 'Петрова Мария Ивановна' },
  { id: '5', username: 'admin_teacher', password: 'teacher2024', role: 'admin', name: 'Соколова Елена Николаевна' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}