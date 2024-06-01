import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstrumentoList from './components/InstrumentoList';
import InstrumentoDetail from './components/InstrumentoDetail';
import Home from './components/Home'; // Importa el componente Home
import 'bootstrap/dist/css/bootstrap.min.css';
import Mapa from './components/Mapa';
import CrearInstrumentoForm from './components/CrearInstrumentoForm';
import ModificarInstrumento from './components/ModificarInstrumento';
import CheckoutMP from './components/CheckoutMP';
import Login from './components/Login';
import { AuthProvider } from './utils/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Usa el componente Home en la ruta base */}
          <Route path="/home" element={<Home />} /> {/* Usa el componente Home en la ruta base */}
          <Route path='/mapa' element={<Mapa />} />
          <Route path="/instrumentos" element={<InstrumentoList />} />
          <Route path="/instrumento/:id" element={<InstrumentoDetail />} />
          <Route path="/crear-instrumento" element={<CrearInstrumentoForm />} />
          <Route path="/instrumentos/:id/modificar" element={<ModificarInstrumento />} />
          <Route path="/mercadopago" element={<CheckoutMP />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;