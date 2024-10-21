import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

type MapComponentProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  description?: string;
};

const defaultCenter = {
  lat: -25.52177, // Coordenada padrão (Curitiba)
  lng: -49.24625,
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries: any = ["places"];

const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  zoom = 14,
  description = "",
}) => {
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(true);

  // Centro do mapa baseado na posição recebida ou no centro padrão
  const center = {
    lat: latitude ?? defaultCenter.lat,
    lng: longitude ?? defaultCenter.lng,
  };

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
    >
      <GoogleMap
        onLoad={(mapInstance) => setGoogleMap(mapInstance)}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
      >
        {/* Adiciona o marcador na posição atual */}
        {latitude && longitude && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            options={{ map: googleMap }}
            onClick={() => setIsInfoWindowOpen(true)}
          >
            {/* Exibe a InfoWindow se estiver aberta */}
            {isInfoWindowOpen && (
              <InfoWindow
                position={{ lat: latitude, lng: longitude }}
                onCloseClick={() => setIsInfoWindowOpen(false)}
              >
                <div style={{ padding: "8px", maxWidth: "200px" }}>
                  <h4 style={{ fontSize: "18px", margin: 0, color: "#333" }}>{description}</h4>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
