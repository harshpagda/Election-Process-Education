import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { electionService } from '../services';
import AnnouncementCard from '../components/common/AnnouncementCard';

export default function LiveElections() {
  const [allElections, setAllElections] = useState([]);
  const [liveElections, setLiveElections] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [timelines, setTimelines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const elections = await electionService.getElections({});
        setAllElections(elections);

        // Separate elections by status
        const ongoing = elections.filter(e => e.status === 'ongoing');
        const upcoming = elections.filter(e => e.status === 'upcoming');

        setLiveElections(ongoing);
        setUpcomingElections(upcoming);

        // Auto-select first ongoing election if any
        if (ongoing.length > 0) {
          setSelectedElection(ongoing[0]);
          await fetchTimelines(ongoing[0]._id);
        } else if (upcoming.length > 0) {
          setSelectedElection(upcoming[0]);
          await fetchTimelines(upcoming[0]._id);
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const fetchTimelines = async (electionId) => {
    try {
      const data = await electionService.getElectionTimelines(electionId);
      setTimelines(data);
    } catch (error) {
      console.error('Error fetching timelines:', error);
    }
  };

  const handleElectionSelect = async (election) => {
    setSelectedElection(election);
    await fetchTimelines(election._id);
  };

  const handleFindBooths = () => {
    navigate('/polling-booths', { 
      state: { constituency: selectedElection?.state } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-3">
            🗳️ Live Elections & Announcements
          </h1>
          <p className="text-xl text-gray-600">
            See real-time election updates and process information
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading elections...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Live Elections Alert */}
            {liveElections.length > 0 && (
              <div className="mb-12 p-6 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md animate-pulse">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">🔴</span>
                  <div>
                    <h2 className="text-2xl font-bold text-red-900">
                      {liveElections.length} Election{liveElections.length !== 1 ? 's'  : ''} LIVE NOW!
                    </h2>
                    <p className="text-red-800 mt-1">
                      Voting is currently happening. Get details below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Elections List */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <h2 className="text-2xl font-bold mb-4">All Elections</h2>

                  {/* Live Elections Section */}
                  {liveElections.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                        <span className="animate-bounce mr-2">🔴</span> Happening Now
                      </h3>
                      <div className="space-y-3">
                        {liveElections.map((election) => (
                          <button
                            key={election._id}
                            onClick={() => handleElectionSelect(election)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              selectedElection?._id === election._id
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-red-400'
                            }`}
                          >
                            <p className="font-semibold text-red-700">{election.name}</p>
                            <p className="text-xs text-red-600 mt-1">🔴 Ongoing</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Elections Section */}
                  {upcomingElections.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center">
                        <span className="mr-2">⏱️</span> Upcoming
                      </h3>
                      <div className="space-y-3">
                        {upcomingElections.slice(0, 5).map((election) => (
                          <button
                            key={election._id}
                            onClick={() => handleElectionSelect(election)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              selectedElection?._id === election._id
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-gray-200 hover:border-yellow-400'
                            }`}
                          >
                            <p className="font-semibold text-gray-900">{election.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {election.year} • {election.state || 'National'}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Panel */}
              <div className="lg:col-span-2">
                {selectedElection ? (
                  <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Election Header */}
                    <div className="mb-6 pb-6 border-b-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900">{selectedElection.name}</h1>
                          <p className="text-gray-600 mt-2">
                            {selectedElection.type === 'general'
                              ? '🇮🇳 General Election'
                              : selectedElection.type === 'state'
                              ? '🏛️ State Election'
                              : '🏘️ Local Election'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold px-4 py-2 rounded-full ${
                            selectedElection.status === 'ongoing'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {selectedElection.status === 'ongoing' ? '🔴 LIVE' : '⏱️ UPCOMING'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Information */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold">Location</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">
                          {selectedElection.state || '🇮🇳 National'}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold">Year</p>
                        <p className="text-2xl font-bold text-purple-600 mt-1">
                          {selectedElection.year}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedElection.description && (
                      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">About This Election</h3>
                        <p className="text-gray-700">{selectedElection.description}</p>
                      </div>
                    )}

                    {/* Timeline */}
                    {timelines.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">📅 Important Dates & Phases</h3>
                        <div className="space-y-4">
                          {timelines.map((timeline, idx) => (
                            <div key={timeline._id} className="relative pl-8">
                              <div className="absolute left-0 top-2 w-4 h-4 bg-blue-600 rounded-full"></div>
                              {idx !== timelines.length - 1 && (
                                <div className="absolute left-1.5 top-6 w-0.5 h-12 bg-blue-300"></div>
                              )}
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="font-semibold text-gray-900">{timeline.phase}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {new Date(timeline.startDate).toLocaleDateString()} to{' '}
                                  {new Date(timeline.endDate).toLocaleDateString()}
                                </p>
                                {timeline.description && (
                                  <p className="text-gray-700 mt-2">{timeline.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={handleFindBooths}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center"
                      >
                        <span className="mr-2">📍</span> Find Polling Booths
                      </button>
                      <button
                        onClick={() => navigate('/chat')}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center"
                      >
                        <span className="mr-2">🤖</span> Ask AI Questions
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-2xl text-gray-600">📭 No elections available</p>
                    <p className="text-gray-500 mt-2">Check back later for announcements</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
