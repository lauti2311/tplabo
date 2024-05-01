import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstrumentoList from './components/InstrumentoList';
import InstrumentoDetail from './components/InstrumentoDetail';
import Home from './components/Home'; // Importa el componente Home
import 'bootstrap/dist/css/bootstrap.min.css';
import Mapa from './components/Mapa';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Usa el componente Home en la ruta base */}
          <Route path='/mapa' element={<Mapa />} />
          <Route path="/instrumentos" element={<InstrumentoList />} />
          <Route path="/instrumento/:id" element={<InstrumentoDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;