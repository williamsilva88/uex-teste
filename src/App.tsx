import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  // Exemplo de coordenadas (Curitiba)
  const latitude = -25.427;
  const longitude = -49.273;
  const description = "Residência Marcos da Silva";

  return (
    <div className="App">
      <h1>Mapa com React e Vite</h1>
      {/* Componente MapComponent com coordenadas definidas */}
      <MapComponent latitude={latitude} longitude={longitude} description={description}/>
    </div>
  );
}

export default App;