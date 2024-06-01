import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  usuario: string | null;
  iniciarSesion: (nombreUsuario: string) => void;
  cerrarSesion: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<string | null>(null);

  const iniciarSesion = (nombreUsuario: string) => {
    setUsuario(nombreUsuario);
  };

  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};