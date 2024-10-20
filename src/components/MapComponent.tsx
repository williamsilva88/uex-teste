import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

type MapComponentProps = {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  description?: string;
  address?: string;
};

const defaultCenter = {
  lat: -25.4300759,
  lng: -49.2717015,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: any = ["places"];

const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  zoom = 14,
  description = "",
  address = "",
}) => {
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(true);

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
        {latitude && longitude && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            options={{ map: googleMap }}
            onClick={() => setIsInfoWindowOpen(true)}
          >
            {isInfoWindowOpen && (
              <InfoWindow
                position={{ lat: latitude, lng: longitude }}
                onCloseClick={() => setIsInfoWindowOpen(false)}
              >
                <div style={{ padding: "8px", maxWidth: "200px" }}>
                  <h4 style={{ fontSize: "18px", margin: 0, color: "#333" }}>{description}</h4>
                  <div style={{ fontSize: "14px", margin: 0, color: "#918b8b", paddingTop: "5px" }}>{address}</div>
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
