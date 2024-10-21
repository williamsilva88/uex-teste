import React from "react";
import MapComponent from "../components/MapComponent";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Página de Mapa</h1>
      <MapComponent latitude={-25.427} longitude={-49.273} />
    </div>
  );
};

export default HomePage;