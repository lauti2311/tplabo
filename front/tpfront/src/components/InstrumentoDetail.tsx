import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Instrumento from '../types/Instrumentos';
import '../styles/InstrumentoDetail.css'; 
import Menu from './Menu';
import { AuthContext } from '../utils/AuthContext';

const InstrumentoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const authContext = useContext(AuthContext);
  const usuario = authContext ? authContext.usuario : undefined;

  useEffect(() => {
    const fetchInstrumento = async () => {
      const response = await fetch(`http://localhost:8080/api/instrumentos/${id}`);
      const data = await response.json();
      setInstrumento(data);
    };

    fetchInstrumento();
  }, [id]);

  const generarPDF = () => {
    window.open("http://localhost:8080/api/pedidos/downloadPdf/" + id, "_blank");
  }

  if (!instrumento) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Menu />
      <div className="instrumento-detail">
        <div className="left">
          <img src={instrumento.imagen} alt={instrumento.instrumento} />
          <p>{instrumento.descripcion}</p>
        </div>
        <div className="right">
          <div className="info-container">
            <small>{instrumento.cantidadVendida} vendidos</small>
            <h1>{instrumento.instrumento}</h1>
            <h2>Precio: {instrumento.precio}</h2>
            <p>Marca: {instrumento.marca}</p>
            <p>Modelo: {instrumento.modelo}</p>
            <p>Costo de envío:</p>
            {instrumento.costoEnvio === 'G' ? 
              <p className='envio-gratis'>
              <img src="/img/camion.png" alt="Envío gratis" style={{ width: '20px', height: '20px', margin: '2px' }} />
              Envío gratis
              </p> 
              : <p>{instrumento.costoEnvio}</p>}
          </div>
          {usuario && usuario.rol === 'ADMIN' && <button onClick={generarPDF}>Generar PDF</button>}
        </div>
      </div>
    </div>
  );
};

export default InstrumentoDetail;