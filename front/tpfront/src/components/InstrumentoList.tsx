import React, { useEffect, useState } from 'react';
import Instrumento from '../types/Instrumentos';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Categoria from '../types/Categoria';
import axios from 'axios';
import Carrito from './Carrito'; // Asegúrate de que la ruta sea correcta
import Pedido from '../types/Pedido';
import PedidoDetalle from '../types/PedidoDetalles';


const InstrumentoList: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[] | undefined>(undefined);
  const [carrito, setCarrito] = useState<Instrumento[]>([]);
  
  const agregarAlCarrito = (instrumento: Instrumento) => {
    setCarrito([...carrito, instrumento]);
  };

  const eliminarDelCarrito = (index: number) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const guardarCarrito = async () => {
    try {
      const total = carrito.reduce((sum, instrumento) => sum + Number(instrumento.precio), 0);
  
      // Crea el objeto Pedido (sin detalles aún)
      const pedido: Pedido = {
        fechaPedido: new Date(),
        totalPedido: total
      };
  
      // Envía el pedido al backend para obtener su ID
      const response = await axios.post<Pedido>('http://localhost:8080/api/pedidos', pedido);
  
      if (response.status === 201) {
        const pedidoId = response.data.id;
  
        // Crea los detalles del pedido (ahora con el ID del pedido)
        const pedidoDetalles: PedidoDetalle[] = carrito.map(instrumento => ({
          cantidad: 1,
          instrumento: { id: instrumento.id },
          pedido: { id: pedidoId } // Asigna el ID del pedido a cada detalle
        }));
  
        // Envía los detalles del pedido al backend
        await axios.post('http://localhost:8080/api/pedidoDetalles', pedidoDetalles);
  
        alert(`El pedido con id ${pedidoId} se guardó correctamente`);
        setCarrito([]);
      } else {
        alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/instrumentos')
    .then(response => response.json())
    .then(data => {
        setInstrumentos(data);
    });
  }, []);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  useEffect(() => {
    fetch('http://localhost:8080/api/categorias')
      .then(response => response.json())
      .then(data => setCategorias(data));
  }, []);
  const deleteInstrumento = (id: string) => {
    fetch(`http://localhost:8080/api/instrumentos/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      // Actualizar la lista de instrumentos después de eliminar
      if (instrumentos) {
        setInstrumentos(instrumentos.filter(instrumento => instrumento.id !== Number(id)));
      }
    });
  };
  const instrumentosFiltrados = instrumentos && categoriaSeleccionada
  ? instrumentos.filter(instrumento => instrumento.idCategoria === Number(categoriaSeleccionada))
  : instrumentos;
  return (
    
    <div className="container" style={{ display: 'flex' }}> 
    <div style={{ flex: 2 }}> {/* Columna izquierda */}
      <Menu />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Lista de Instrumentos</h2>
        <Link to="/crear-instrumento">
          <button>Agregar Instrumento</button>
        </Link>
      </div>
      <div>
        <label>Filtrar por categoría: </label>
        <select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
          ))}
        </select>
      </div>
      {instrumentosFiltrados === undefined ? (
        <p>Cargando instrumentos...</p>
      ) : (
        instrumentosFiltrados.length > 0 ? (
          instrumentosFiltrados.map((instrumento: Instrumento) => (
            <div className="instrumento" key={instrumento.id}>
              <img src={instrumento.imagen} alt={instrumento.instrumento} />
              <div>
                <h3>{instrumento.instrumento}</h3>
                <p>Precio: ${instrumento.precio}</p>
                {instrumento.costoEnvio !== 'G' && <p style={{ color: 'orange' }}>Costo de Envío: {instrumento.costoEnvio}</p>}
                {instrumento.costoEnvio === 'G' &&
                  <p style={{ color: 'green' }}>
                    <img src="img/camion.png" style={{ width: '20px', height: '20px', margin: '2px' }} />
                    Envios Gratis
                  </p>}
                <button onClick={() => deleteInstrumento(instrumento.id.toString())}>Eliminar Instrumento</button>
                <Link to={`/instrumentos/${instrumento.id}/modificar`}>
                  <button>Modificar Instrumento</button>
                </Link>
                <button onClick={() => agregarAlCarrito(instrumento)}>
                  Agregar al carrito
                </button>

              </div>

            </div>
          ))
        ) : (
          <p>No hay instrumentos disponibles.</p>
        )
      )}
    </div>
    <div style={{ flex: 1, marginLeft: '20px', position: 'sticky', top: '0' }}> {/* Columna derecha */}
        <Carrito carrito={carrito} onEliminarDelCarrito={eliminarDelCarrito} />
        <button onClick={guardarCarrito} disabled={carrito.length === 0}>Guardar Carrito</button>
      </div>
    </div>
  );
};

export default InstrumentoList;