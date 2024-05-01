import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Mapa = () => {
  const position = { lat: -32.886288, lng: -68.838299 }; // Coordenadas de Av. Las Heras y Av. San Martin, Ciudad de Mendoza

  return (
    <LoadScript googleMapsApiKey="AIzaSyBSKBFrnFlCGZy5RTO4sShdOOCfYkWFlsc">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100vh' }}
        center={position}
        zoom={13}
      >
        <Marker 
          position={position}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default Mapa;