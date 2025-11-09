import React, { useState, createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { User, Profile } from './types';
import Header from './components/Header';
import Mural from './features/Mural';
import Calendario from './features/Calendario';
import Tarefas from './features/Tarefas';
import Recursos from './features/Recursos';
import Login from './features/Login';
import { XMarkIcon } from './components/Icons';
import { login as apiLogin } from './services/api';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Toast Notification System ---
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center justify-between w-full max-w-xs p-4 text-white rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-4 -mr-1 p-1 rounded-md hover:bg-white/20">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activePage, setActivePage] = useState<string>('Mural');
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('contempsico-user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('contempsico-user');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await apiLogin(email, password);
      setCurrentUser(user);
      localStorage.setItem('contempsico-user', JSON.stringify(user));
      setActivePage('Mural'); // Reset page on login
    } catch (error) {
      if (error instanceof Error) {
        addToast(error.message, 'error');
      } else {
        addToast('An unknown error occurred.', 'error');
      }
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('contempsico-user');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Mural':
        return <Mural setActivePage={setActivePage} />;
      case 'Calendário':
        return <Calendario />;
      case 'Tarefas':
        return <Tarefas />;
      case 'Recursos':
        return <Recursos />;
      default:
        return <Mural setActivePage={setActivePage} />;
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex justify-center items-center">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
        {!currentUser ? (
          <Login />
        ) : (
          <div className="min-h-screen flex flex-col">
            <Header activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-4 md:p-8">
              {renderPage()}
            </main>
          </div>
        )}
    </AuthContext.Provider>
  );
};

const AppWrapper: React.FC = () => (
    <ToastProvider>
        <App />
    </ToastProvider>
);

export default AppWrapper;