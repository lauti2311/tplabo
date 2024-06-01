import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Menu.css';
import { AuthContext } from '../utils/AuthContext';

const Menu = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('authContext is undefined, please ensure AuthProvider is set up correctly');
  }

  const { usuario, cerrarSesion } = authContext;
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/");
  };

  return (
    <nav className="menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/mapa">Donde Estamos</Link></li>
        <li><Link to="/instrumentos">Productos</Link></li>
        {usuario && <li>Usuario: {usuario.nombre}, Rol: {usuario.rol}</li>}
        <li><button onClick={handleCerrarSesion}>Cerrar Sesión</button></li>
      </ul>
    </nav>
  );
}

export default Menu;