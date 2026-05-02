import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import MapComponent from '../components/common/MapComponent';
import { pollingService } from '../services';

export default function PollingBooths() {
  const { location, error: geoError, loading: geoLoading } = useGeolocation();
  const [booths, setBooths] = useState([]);
  const [nearestBooths, setNearestBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5); // km
  const [constituency, setConstituency] = useState('');

  // Fetch booths
  useEffect(() => {
    const fetchBooths = async () => {
      try {
        setLoading(true);
        const data = await pollingService.getBooths();
        setBooths(data);
      } catch (error) {
        console.error('Error fetching booths:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooths();
  }, []);

  // Find nearest booths when location is available
  useEffect(() => {
    const findNearestBooths = async () => {
      if (!location) return;
      try {
        const nearby = await pollingService.findNearestBooths(
          location.latitude,
          location.longitude,
          searchRadius
        );
        setNearestBooths(nearby);
      } catch (error) {
        console.error('Error finding nearest booths:', error);
      }
    };
    findNearestBooths();
  }, [location, searchRadius]);

  // Filter by constituency
  const filteredBooths = constituency
    ? booths.filter(booth => booth.constituency === constituency)
    : booths;

  const displayBooths = nearestBooths.length > 0 ? nearestBooths : filteredBooths;

  const uniqueConstituencies = [...new Set(booths.map(b => b.constituency))].sort();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📍 Find Your Polling Booth</h1>
          <p className="text-xl text-gray-600">
            Locate the nearest polling booth and get all details
          </p>
        </div>

        {/* Location Status */}
        <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200">
          {geoLoading && (
            <p className="text-blue-600 font-semibold">📍 Detecting your location...</p>
          )}
          {geoError && (
            <p className="text-orange-600 font-semibold">
              ⚠️ Geolocation: {geoError}. Use filters below to find booths.
            </p>
          )}
          {location && !geoError && (
            <p className="text-green-600 font-semibold">
              ✓ Location found! Showing booths within {searchRadius}km.
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h2 className="text-xl font-bold mb-4">Polling Booths Map</h2>
              <MapComponent
                center={[20.5937, 78.9629]}
                booths={displayBooths}
                userLocation={location}
                zoom={location ? 13 : 4}
                onBoothClick={(booth) => setSelectedBooth(booth)}
              />
            </div>

            {/* Search Controls */}
            {location && !geoError && (
              <div className="bg-white rounded-lg shadow p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Radius: {searchRadius}km
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Adjust radius to find booths in different distances
                </p>
              </div>
            )}
          </div>

          {/* Booths List */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">
                {nearestBooths.length > 0 ? 'Nearby Booths' : 'Polling Booths'}
              </h2>

              {/* Filter by Constituency */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Constituency
                </label>
                <select
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Constituencies</option>
                  {uniqueConstituencies.map((const_name) => (
                    <option key={const_name} value={const_name}>
                      {const_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Booths Count */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">
                  {displayBooths.length} booth{displayBooths.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Booths List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-center text-gray-500">Loading booths...</p>
                ) : displayBooths.length > 0 ? (
                  displayBooths.map((booth) => (
                    <div
                      key={booth._id}
                      onClick={() => setSelectedBooth(booth)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                        selectedBooth?._id === booth._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900">{booth.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{booth.constituency}</p>
                      <p className="text-xs text-gray-700 mt-1">⏰ {booth.votingHours}</p>
                      <p className="text-xs text-gray-700">👥 {booth.capacity} voters</p>
                      {booth.accessibilityFeatures?.length > 0 && (
                        <p className="text-xs text-green-600 mt-1 font-semibold">♿ Accessible</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm">No booths found</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Booth Details */}
        {selectedBooth && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold mb-4">{selectedBooth.name}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Constituency:</strong> {selectedBooth.constituency}</p>
                  <p><strong>Voting Hours:</strong> {selectedBooth.votingHours}</p>
                  <p><strong>Capacity:</strong> {selectedBooth.capacity} voters</p>
                  <p><strong>Contact:</strong> {selectedBooth.contactNumber || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Accessibility</h3>
                {selectedBooth.accessibilityFeatures?.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedBooth.accessibilityFeatures.map((feature, idx) => (
                      <li key={idx} className="text-green-600 font-semibold">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No special accessibility features listed</p>
                )}
              </div>
            </div>

            {selectedBooth.description && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <p className="text-gray-700">{selectedBooth.description}</p>
              </div>
            )}

            {location && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-semibold">
                  📍 Distance from your location: ~{' '}
                  {Math.round(
                    Math.sqrt(
                      Math.pow(selectedBooth.location.coordinates[1] - location.latitude, 2) +
                      Math.pow(selectedBooth.location.coordinates[0] - location.longitude, 2)
                    ) * 111 // Rough conversion to km
                  )}{' '}
                  km
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
