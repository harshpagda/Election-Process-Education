import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const boothIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent({ 
  center = [20.5937, 78.9629], 
  booths = [], 
  userLocation = null, 
  zoom = 12,
  onBoothClick = null 
}) {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation ? [userLocation.latitude, userLocation.longitude] : center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location circle and marker */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={userLocation.accuracy || 100}
              pathOptions={{ color: 'blue', opacity: 0.2 }}
            />
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Your Location</p>
                  <p className="text-gray-600">Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Polling booths */}
        {booths.map((booth) => (
          <Marker
            key={booth._id}
            position={[booth.coordinates?.coordinates[1] || 0, booth.coordinates?.coordinates[0] || 0]}
            icon={boothIcon}
            eventHandlers={{
              click: () => onBoothClick && onBoothClick(booth),
            }}
          >
            <Popup>
              <div className="text-sm min-w-max">
                <p className="font-semibold text-blue-600">{booth.name}</p>
                <p className="text-gray-600">{booth.constituency}</p>
                <p className="text-gray-700 mt-2">
                  <span className="font-medium">Voting Hours:</span> {booth.votingHours}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Capacity:</span> {booth.capacity} voters
                </p>
                {booth.accessibilityFeatures?.length > 0 && (
                  <p className="text-gray-700 mt-1">
                    <span className="font-medium">Accessible:</span> Yes ✓
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
