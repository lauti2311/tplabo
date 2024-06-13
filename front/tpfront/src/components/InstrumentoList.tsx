import React, { useContext, useEffect, useState } from 'react';
import Instrumento from '../types/Instrumentos';
import { Link } from 'react-router-dom';
import Menu from './Menu';
import Categoria from '../types/Categoria';
import axios from 'axios';
import Carrito from './Carrito';
import Pedido from '../types/Pedido';
import PedidoDetalle from '../types/PedidoDetalles';
import CarritoItem from '../types/CarritoItem'; // Importa CarritoItem
import { AuthContext } from '../utils/AuthContext'; // Asegúrate de que la ruta sea correcta
import Modal from 'react-modal'; // Importa Modal
import '../styles/InstrumentoList.css'; // Importa los estilos
import '../styles/Menu.css';

const InstrumentoList: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[] | undefined>(undefined);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const authContext = useContext(AuthContext);
  const usuario = authContext ? authContext.usuario : undefined;
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showModal, setShowModal] = useState(false);

  const cerrarModal = () => {
    setShowModal(false);
  };

  const generarExcel = () => {
    if (fechaDesde && fechaHasta) {
      // Añadir la hora a las fechas
      const fechaDesdeConHora = `${fechaDesde}T00:00:00`;
      const fechaHastaConHora = `${fechaHasta}T23:59:59`;

      const url = `http://localhost:8080/api/pedidos/downloadExcel?fechaDesde=${fechaDesdeConHora}&fechaHasta=${fechaHastaConHora}`;

      // Abrir la URL en una nueva pestaña
      window.open(url, '_blank');
      cerrarModal();
    } else {
      alert('Por favor ingresa ambas fechas.');
    }
  };

  const agregarAlCarrito = (instrumento: Instrumento) => {
    const index = carrito.findIndex(item => item.instrumento.id === instrumento.id);
    if (index !== -1) {
      const newCarrito = [...carrito];
      newCarrito[index].cantidad += 1;
      setCarrito(newCarrito);
    } else {
      setCarrito([...carrito, { instrumento, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (index: number) => {
    const nuevoCarrito = [...carrito];
    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad -= 1;
    } else {
      nuevoCarrito.splice(index, 1);
    }
    setCarrito(nuevoCarrito);
  };

  const guardarCarrito = async () => {
    try {
      const total = carrito.reduce((sum, item) => sum + (Number(item.instrumento.precio) * item.cantidad), 0);

      const pedido: Pedido = {
        fechaPedido: new Date(),
        totalPedido: total
      };

      const response = await axios.post<Pedido>('http://localhost:8080/api/pedidos', pedido);

      if (response.status === 201) {
        const pedidoId = response.data.id;

        const pedidoDetalles: PedidoDetalle[] = carrito.map(item => ({
          cantidad: item.cantidad,
          instrumento: { id: item.instrumento.id },
          pedido: {
            id: pedidoId,
            fechaPedido: new Date(),
            totalPedido: total
          }
        }));

        await axios.post('http://localhost:8080/api/pedidoDetalles', pedidoDetalles);

        for (const item of carrito) {
          const instrumento = item.instrumento;
          await axios.put(`http://localhost:8080/api/instrumentos/${instrumento.id}/venta`, { cantidad: item.cantidad }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
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
    fetch('http://localhost:8080/api/instrumentos/activos')
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
        if (instrumentos) {
          setInstrumentos(instrumentos.filter(instrumento => instrumento.id !== Number(id)));
        }
      });
  };

  const instrumentosFiltrados = instrumentos && categoriaSeleccionada
    ? instrumentos.filter(instrumento => instrumento.idCategoria === Number(categoriaSeleccionada))
    : instrumentos;

  return (
    <div>
    <div> {/* Menú a la izquierda */}
      <div className="menu">
        <Menu /> 
      </div>
      {/* Resto del contenido del menú */}
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <h2>Lista de Instrumentos</h2>
        {usuario && usuario.rol !== 'VISOR' && (
          <Link to="/crear-instrumento">
            <button>Agregar Instrumento</button>
          </Link>
        )}
        {usuario && usuario.rol === 'ADMIN' && (
          <button onClick={() => setShowModal(true)}>Generar Excel</button>
        )}
      </div>
        <Modal isOpen={showModal} onRequestClose={cerrarModal}>
          <h2>Generar Excel</h2>
          <label>Fecha desde: </label>
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
          <label>Fecha hasta: </label>
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
          <button onClick={generarExcel}>Generar</button>
          <button onClick={cerrarModal}>Cerrar</button>
        </Modal>
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
                <img className="instrumento-imagen" src={instrumento.imagen} alt={instrumento.instrumento} />
                <div>
                  <h3>{instrumento.instrumento}</h3>
                  <p>Precio: ${instrumento.precio}</p>
                  {instrumento.costoEnvio !== 'G' && <p style={{ color: 'orange' }}>Costo de Envío: {instrumento.costoEnvio}</p>}
                  {instrumento.costoEnvio === 'G' &&
                    <p style={{ color: 'green' }}>
                      <img src="img/camion.png" style={{ width: '20px', height: '20px', margin: '2px' }} />
                      Envios Gratis
                    </p>}
                  {usuario && usuario.rol !== 'VISOR' && (
                    <>
                      <button onClick={() => deleteInstrumento(instrumento.id.toString())}>Eliminar Instrumento</button>
                      <Link to={`/instrumentos/${instrumento.id}/modificar`}>
                        <button>Modificar Instrumento</button>
                      </Link>
                    </>
                  )}
                  <button onClick={() => agregarAlCarrito(instrumento)}>
                    Agregar al carrito
                  </button>
                  <Link to={`/instrumento/${instrumento.id}`}>
                    <button>Ver detalles</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No hay instrumentos disponibles.</p>
          )
        )}
      </div>
      <div className='carrito-container'> {/* Carrito */}
      <Carrito carrito={carrito} onEliminarDelCarrito={eliminarDelCarrito} />
        <button onClick={guardarCarrito} disabled={carrito.length === 0}>Guardar Carrito</button>
      </div>
    </div>
  );
};

export default InstrumentoList;
