import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Instrumento from '../types/Instrumentos';
import '../styles/InstrumentoAdmin.css';
import Menu from './Menu';
import { Modal } from 'react-bootstrap';
const InstrumentoAdmin: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
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

  useEffect(() => {
    // Función para obtener instrumentos activos
    const fetchInstrumentosActivos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/instrumentos/activos');
        const data = await response.json();
        return data; // Devolver los instrumentos activos
      } catch (error) {
        console.error('Error al obtener instrumentos activos:', error);
        return []; // Devolver un array vacío en caso de error
      }
    };

    // Función para obtener instrumentos eliminados
    const fetchInstrumentosEliminados = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/instrumentos/eliminados');
        const data = await response.json();
        return data; // Devolver los instrumentos eliminados
      } catch (error) {
        console.error('Error al obtener instrumentos eliminados:', error);
        return []; // Devolver un array vacío en caso de error
      }
    };

    // Ejecutar ambas peticiones en paralelo y combinar los resultados
    Promise.all([fetchInstrumentosActivos(), fetchInstrumentosEliminados()])
      .then(([activos, eliminados]) => {
        setInstrumentos([...activos, ...eliminados]); // Combinar y actualizar el estado
      })
      .catch(error => {
        console.error('Error al obtener instrumentos:', error);
      });
  }, []);
  const eliminarInstrumento = (id: number) => {
    axios.delete(`http://localhost:8080/api/instrumentos/${id}`)
    .then(() => {
      setInstrumentos(instrumentos.map(instrumento => 
        instrumento.id === id ? { ...instrumento, isDeleted: true } : instrumento
      ));
    });
  };

  const restaurarInstrumento = (id: number) => {
    axios.put(`http://localhost:8080/api/instrumentos/${id}/restaurar`)
      .then(() => {
        setInstrumentos(instrumentos.map(instrumento =>
          instrumento.id === id ? { ...instrumento, isDeleted: false } : instrumento
        ));
      });
  };

  

  return (
    <div className="menu">
        <Menu /> 
    <div>
      <Link to="/crear-instrumento">
        <button>Agregar Instrumento</button>
      </Link>
      <button onClick={() => setShowModal(true)}>Generar Excel</button>
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Generar Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body"> {/* Aplica la clase CSS */}
          <label>Fecha desde:</label>
          <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
          <label>Fecha hasta:</label>
          <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={generarExcel}>Generar</button>
          <button onClick={cerrarModal}>Cerrar</button>
        </Modal.Footer>
      </Modal>
      <table> 
        <thead>
          <tr>
            <th>Instrumento</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Precio</th>
            <th>Cantidad vendida</th>
            <th>Costo de envío</th>
            <th>Categoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instrumentos.map(instrumento => (
            <tr
              key={instrumento.id}
              className={instrumento.isDeleted ? 'eliminado' : ''} // Clase para filas eliminadas
            >
              <td>{instrumento.instrumento}</td>
              <td>{instrumento.marca}</td>
              <td>{instrumento.modelo}</td>
              <td>{instrumento.precio}</td>
              <td>{instrumento.cantidadVendida}</td>
              <td>{instrumento.costoEnvio}</td>
              <td>{instrumento.idCategoria}</td>
              <td className="acciones">
                <button onClick={() => instrumento.isDeleted ? restaurarInstrumento(instrumento.id) : eliminarInstrumento(instrumento.id)}>
                  {instrumento.isDeleted ? 'Dar de alta' : 'Eliminar'}
                </button>
                <Link to={`/instrumentos/${instrumento.id}/modificar`}>
                  <button>Modificar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default InstrumentoAdmin;