import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Rol } from '../types/Usuario';

interface AuthContextType {
  usuario: { nombre: string, rol: Rol } | null;
  iniciarSesion: (nombreUsuario: string, rol: Rol) => void;
  cerrarSesion: () => void;
  actualizarRol: (nuevoRol: Rol) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<{ nombre: string, rol: Rol } | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const usuarioAlmacenado = localStorage.getItem('usuario');
    if (usuarioAlmacenado) {
      console.log('AuthProvider - Usuario recuperado del localStorage:', usuarioAlmacenado); // Debugging
      setUsuario(JSON.parse(usuarioAlmacenado));
    }
    setCargando(false);
  }, []);

  const iniciarSesion = (nombreUsuario: string, rol: Rol) => {
    const usuario = { nombre: nombreUsuario, rol };
    setUsuario(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    console.log('AuthProvider - Usuario iniciado sesión:', usuario); // Debugging
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    console.log('AuthProvider - Usuario cerró sesión'); // Debugging
  };

  const actualizarRol = (nuevoRol: Rol) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, rol: nuevoRol };
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      console.log('AuthProvider - Rol actualizado:', usuarioActualizado); // Debugging
    }
  };

  console.log('AuthContext - Usuario actual:', usuario); // Debugging

  if (cargando) {
    return null; // O devuelve tu componente de carga aquí
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, actualizarRol }}>
      {children}
    </AuthContext.Provider>
  );
};