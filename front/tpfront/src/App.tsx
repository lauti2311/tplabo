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
import { RutaPrivada } from './utils/RutaPrivada';
import ChartsGoogle from './components/ChartsGoogle';
import InstrumentoAdmin from './components/InstrumentoAdmin';
import { Rol } from './types/Usuario';


const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <div>
      <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path='/mapa' element={<Mapa />} />
            <Route path="/instrumentos" element={<InstrumentoList />} />
            <Route path="/instrumento/:id" element={<InstrumentoDetail />} />
            <Route path="/crear-instrumento" element={<RutaPrivada rolesPermitidos={[Rol.ADMIN, Rol.OPERADOR]}><CrearInstrumentoForm /></RutaPrivada>} />
            <Route path="/instrumentos/:id/modificar" element={<RutaPrivada rolesPermitidos={[Rol.ADMIN, Rol.OPERADOR]}><ModificarInstrumento /></RutaPrivada>} />
            <Route path="/mercadopago" element={<RutaPrivada rolesPermitidos={[Rol.ADMIN, Rol.OPERADOR]}><CheckoutMP /></RutaPrivada>} />
            <Route path='/google-charts' element={<RutaPrivada rolesPermitidos={[Rol.ADMIN, Rol.OPERADOR]}><ChartsGoogle /></RutaPrivada>} />
            <Route path='/instrumento-admin' element={<RutaPrivada rolesPermitidos={[Rol.ADMIN]}><InstrumentoAdmin /></RutaPrivada>} />
            <Route path="*" element={<Login />} />
          </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;