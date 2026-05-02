import React, { useState, useEffect } from 'react';
import { electionService } from '../services';

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    state: '',
    status: '',
  });

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await electionService.getElections(filters);
        setElections(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching elections:', error);
        setLoading(false);
      }
    };
    fetchElections();
  }, [filters]);

  const handleElectionClick = async (election) => {
    setSelectedElection(election);
    try {
      const timelineData = await electionService.getElectionTimelines(election._id);
      setTimelines(timelineData);
    } catch (error) {
      console.error('Error fetching timelines:', error);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Elections & Timeline</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="state">State</option>
            <option value="local">Local</option>
          </select>

          <select
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All States</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Elections List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Elections</h2>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="space-y-2">
                {elections.map((election) => (
                  <button
                    key={election._id}
                    onClick={() => handleElectionClick(election)}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedElection?._id === election._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border hover:shadow-lg'
                    }`}
                  >
                    <h3 className="font-semibold">{election.name}</h3>
                    <p className="text-sm opacity-75">{election.type} - {election.year}</p>
                    <p className="text-sm opacity-75">Status: {election.status}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Election Details and Timeline */}
          <div className="lg:col-span-2">
            {selectedElection ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedElection.name}</h2>
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-semibold capitalize">{selectedElection.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Year</p>
                      <p className="font-semibold">{selectedElection.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-semibold capitalize">{selectedElection.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">State</p>
                      <p className="font-semibold">{selectedElection.state}</p>
                    </div>
                  </div>
                  {selectedElection.description && (
                    <div className="mt-4">
                      <p className="text-gray-600">Description</p>
                      <p>{selectedElection.description}</p>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4">Important Dates</h3>
                {timelines.length > 0 ? (
                  <div className="space-y-4">
                    {timelines.map((timeline) => (
                      <div key={timeline._id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
                        <h4 className="font-semibold text-lg">{timeline.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(timeline.startDate).toLocaleDateString()} to {new Date(timeline.endDate).toLocaleDateString()}
                        </p>
                        {timeline.description && (
                          <p className="text-gray-700 mt-2">{timeline.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No timelines available</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg">Select an election to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
