import React, { useState, useContext } from 'react';
import { sha1 } from 'js-sha1';
import Usuario from '../types/Usuario';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import './Login.css';


function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('useAuth debe estar dentro del proveedor AuthContext');
  }
  
  const { iniciarSesion } = auth;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/usuarios');
      const usuarios: Usuario[] = await response.json();

      // Encripta la clave ingresada antes de compararla
      const claveEncriptada = sha1(clave);
      console.log("Clave encriptada:", claveEncriptada);

      const usuario = usuarios.find(usuario => 
        usuario.nombreUsuario === nombreUsuario && usuario.clave === claveEncriptada
      );

      if (usuario) {
        console.log('Inicio de sesión exitoso:', usuario);
        iniciarSesion(usuario.nombreUsuario); // Aquí llamamos a iniciarSesion
        navigate('/home');
      } else {
        console.error('Error de inicio de sesión: usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        Nombre de usuario:
        <input type="text" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} className="input" />
      </label>
      <label>
        Contraseña:
        <input type="password" value={clave} onChange={e => setClave(e.target.value)} className="input" />
      </label>
      <input type="submit" value="Iniciar sesión" className="submit" />
    </form>
  );
}

export default Login;
