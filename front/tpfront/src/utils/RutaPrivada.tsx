import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Rol } from '../types/Usuario';

interface RutaPrivadaProps {
  children: React.ReactNode;
  rolesPermitidos: Rol[];
}

export const RutaPrivada = ({ children, rolesPermitidos }: RutaPrivadaProps) => {
  const authContext = useContext(AuthContext);
  const usuario = authContext?.usuario;
  const location = useLocation();

  console.log('RutaPrivada - Usuario:', usuario); // Debugging
  console.log('RutaPrivada - Roles Permitidos:', rolesPermitidos); // Debugging

  if (!usuario) {
    console.log('Redirigiendo al login, usuario no autenticado.'); // Debugging
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const estaAutenticado = rolesPermitidos.includes(usuario.rol);
  console.log('RutaPrivada - Está Autenticado:', estaAutenticado); // Debugging

  if (estaAutenticado) {
    return <>{children}</>;
  }

  console.log('Redirigiendo a /home, usuario no tiene rol permitido.'); // Debugging
  return <Navigate to="/home" replace />;
};
