import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  return (
    <nav className="menu">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/mapa">Donde Estamos</Link></li>
        <li><Link to="/instrumentos">Productos</Link></li>
      </ul>
    </nav>
  );
}

export default Menu;