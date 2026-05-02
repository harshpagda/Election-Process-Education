import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authService, electionService } from '../services';
import AnnouncementCard from '../components/common/AnnouncementCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [elections, setElections] = useState([]);
  const [liveElections, setLiveElections] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionsData = await electionService.getElections({});
        setElections(electionsData);
        setLiveElections(electionsData.filter((election) => election.status === 'ongoing'));
        setUpcomingElections(electionsData.filter((election) => election.status === 'upcoming'));

        if (user?.dateOfBirth) {
          const eligData = await authService.checkEligibility(user.dateOfBirth, user.state);
          setEligibility(eligData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleElectionSelect = () => {
    navigate('/live-elections');
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-4xl font-bold text-transparent">
            Welcome, {user?.firstName}! 🗳️
          </h1>
          <p className="mt-2 text-lg text-gray-600">Stay informed about elections and the voting process</p>
        </div>

        {eligibility && (
          <div
            className={`mb-8 rounded-lg border-l-4 p-6 shadow-md ${
              eligibility.isEligible ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'
            }`}
          >
            <h2 className={`mb-2 text-lg font-semibold ${eligibility.isEligible ? 'text-green-900' : 'text-yellow-900'}`}>
              Voter Eligibility Status
            </h2>
            <p className={eligibility.isEligible ? 'text-green-800' : 'text-yellow-800'}>{eligibility.message}</p>
            {eligibility.isEligible && <p className="mt-2 font-semibold text-green-700">✓ You are eligible to vote!</p>}
          </div>
        )}

        {liveElections.length > 0 && (
          <div className="mb-8 animate-pulse rounded-lg border-l-4 border-red-600 bg-red-50 p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <span className="mr-4 text-4xl">🔴</span>
                <div>
                  <h2 className="text-2xl font-bold text-red-900">
                    {liveElections.length} Election{liveElections.length !== 1 ? 's' : ''} LIVE NOW!
                  </h2>
                  <p className="mt-1 text-red-800">Voting is currently happening. Get all details below.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/live-elections')}
                className="whitespace-nowrap rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                View Now →
              </button>
            </div>
          </div>
        )}

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="cursor-pointer rounded-lg border-2 border-transparent bg-white p-6 shadow transition hover:border-blue-200 hover:shadow-lg">
            <div className="mb-2 text-4xl">📚</div>
            <h3 className="mb-2 text-lg font-semibold">Learn</h3>
            <p className="text-gray-600">Understand the election process step by step</p>
            <a href="/faq" className="mt-4 inline-block font-semibold text-blue-600 hover:underline">
              Start Learning →
            </a>
          </div>

          <div className="cursor-pointer rounded-lg border-2 border-transparent bg-white p-6 shadow transition hover:border-purple-200 hover:shadow-lg">
            <div className="mb-2 text-4xl">🤖</div>
            <h3 className="mb-2 text-lg font-semibold">Ask AI</h3>
            <p className="text-gray-600">Chat with our AI assistant for any election questions</p>
            <a href="/chat" className="mt-4 inline-block font-semibold text-purple-600 hover:underline">
              Start Chat →
            </a>
          </div>

          <div className="cursor-pointer rounded-lg border-2 border-transparent bg-white p-6 shadow transition hover:border-green-200 hover:shadow-lg">
            <div className="mb-2 text-4xl">📍</div>
            <h3 className="mb-2 text-lg font-semibold">Find Booth</h3>
            <p className="text-gray-600">Locate your nearest polling booth with map</p>
            <a href="/polling-booths" className="mt-4 inline-block font-semibold text-green-600 hover:underline">
              Find Booth →
            </a>
          </div>
        </div>

        {liveElections.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-red-600">🔴 Elections Happening Now</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveElections.map((election) => (
                <AnnouncementCard key={election._id} election={election} onClick={handleElectionSelect} />
              ))}
            </div>
          </div>
        )}

        {upcomingElections.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-yellow-600">⏱️ Upcoming Elections</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingElections.slice(0, 6).map((election) => (
                <AnnouncementCard key={election._id} election={election} onClick={handleElectionSelect} />
              ))}
            </div>
            {upcomingElections.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/live-elections')}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  View All Elections →
                </button>
              </div>
            )}
          </div>
        )}

        {elections.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-2xl text-gray-600">📭 No elections available</p>
            <p className="mt-2 text-gray-500">Check back later for announcements</p>
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">📋 All Elections</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-300 bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Election</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Year</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => (
                    <tr
                      key={election._id}
                      className="cursor-pointer border-b transition hover:bg-gray-50"
                      onClick={() => handleElectionSelect(election)}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">{election.name}</td>
                      <td className="px-6 py-4 capitalize text-gray-600">
                        {election.type === 'general' ? '🇮🇳' : election.type === 'state' ? '🏛️' : '🏘️'} {election.type}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{election.state || 'National'}</td>
                      <td className="px-6 py-4 font-semibold text-gray-600">{election.year}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            election.status === 'ongoing'
                              ? 'bg-red-100 text-red-700'
                              : election.status === 'upcoming'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {election.status === 'ongoing' && '🔴 '}
                          {election.status === 'upcoming' && '⏱️ '}
                          {election.status === 'completed' && '✓ '}
                          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
