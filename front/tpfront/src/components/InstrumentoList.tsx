import React, { useEffect, useState } from 'react';
import Instrumento from '../types/Instrumentos';
import { Link } from 'react-router-dom';
import Menu from './Menu';


const InstrumentoList: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[] | undefined>(undefined);

    useEffect(() => {
      fetch('http://localhost:8080/api/instrumentos')
      .then(response => response.json())
      .then(data => {
          setInstrumentos(data);
      });
    }, []);
  
    return (
      <div className='container'>
        <Menu />
        <h2>Lista de Instrumentos</h2>
        {instrumentos === undefined ? (
          <p>Cargando instrumentos...</p>
        ) : (
          instrumentos.length > 0 ? (
            instrumentos.map((instrumento: Instrumento) => (
              <div className="instrumento" key={instrumento.id}>
                <img src={instrumento.imagen} alt={instrumento.instrumento} />
                <div>
                  <h3>{instrumento.instrumento}</h3>
                  <p>Precio: ${instrumento.precio}</p>
                  {instrumento.costoEnvio !== 'G' && <p style={{ color: 'orange' }}>Costo de Envío: {instrumento.costoEnvio}</p>}
                  {instrumento.costoEnvio === 'G' && 
                    <p style={{ color: 'green' }}>
                      <img src="img/camion.png"  style={{ width: '20px', height: '20px', margin: '2px' }} />
                      Envios Gratis
                    </p>
                    
                  }
                  <p>Cantidad Vendida: {instrumento.cantidadVendida}</p>
                  <Link to={`/instrumento/${instrumento.id}`}>Ver Detalle</Link>
                </div>
                
              </div>
            ))
          ) : (
            <p>No hay instrumentos disponibles.</p>
          )
        )}
      </div>
    );
  }
  
  export default InstrumentoList;