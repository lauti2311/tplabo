import React from 'react';
import Instrumento from '../types/Instrumentos';

interface CarritoProps {
  carrito: Instrumento[];
  onEliminarDelCarrito: (index: number) => void; // Función para eliminar del carrito
}

const Carrito: React.FC<CarritoProps> = ({ carrito, onEliminarDelCarrito }) => {
  const total = carrito.reduce((sum, instrumento) => sum + Number(instrumento.precio), 0);

  return (
    <div className="carrito">
      <h2>Carrito</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          <ul>
            {carrito.map((instrumento, index) => (
              <li key={index}>
                {instrumento.instrumento} - ${instrumento.precio}
                <button onClick={() => onEliminarDelCarrito(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total}</p>
        </>
      )}
    </div>
  );
};

export default Carrito;