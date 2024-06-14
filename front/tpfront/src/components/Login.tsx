import React, { useState, useContext } from 'react';
import Usuario from '../types/Usuario';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import '../styles/Login.css';
import { encode as base64Encode } from 'base64-arraybuffer';

function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  function sha1Base64(str) {
    const buffer = new TextEncoder().encode(str);
    return window.crypto.subtle.digest('SHA-1', buffer).then(hash => {
      return base64Encode(hash);
    });
  }

  if (!auth) {
    throw new Error('useAuth debe estar dentro del proveedor AuthContext');
  }

  const { iniciarSesion } = auth;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/usuarios');
      const usuarios: Usuario[] = await response.json();
  
      const claveEncriptada = await sha1Base64(clave);
  
      const usuario = usuarios.find(usuario => 
        usuario.nombreUsuario === nombreUsuario && usuario.clave === claveEncriptada
      );
  
      if (usuario) {
        console.log('Login - Inicio de sesión exitoso:', usuario); // Debugging
        iniciarSesion(usuario.nombreUsuario, usuario.rol);
        navigate('/home');
      } else {
        console.error('Login - Error de inicio de sesión: usuario no encontrado');
      }
    } catch (error) {
      console.error('Login - Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Iniciar Sesión</h2>
        <label className="form-label">
          Nombre de usuario:
          <input type="text" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} className="input" />
        </label>
        <label className="form-label">
          Contraseña:
          <input type="password" value={clave} onChange={e => setClave(e.target.value)} className="input" />
        </label>
        <input type="submit" value="Iniciar sesión" className="submit" />
      </form>
    </div>
  );
}

export default Login;
