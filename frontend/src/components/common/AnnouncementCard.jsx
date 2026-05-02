import React from 'react';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

export default function AnnouncementCard({ election, onClick }) {
  const getStatusIcon = () => {
    switch (election.status) {
      case 'upcoming':
        return <FaClock className="text-yellow-500 text-2xl" />;
      case 'ongoing':
        return <FaExclamationTriangle className="text-red-500 text-2xl" />;
      case 'completed':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (election.status) {
      case 'upcoming':
        return 'bg-yellow-50 border-yellow-200';
      case 'ongoing':
        return 'bg-red-50 border-red-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (election.status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing Now!';
      case 'completed':
        return 'Completed';
      default:
        return 'Announced';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-lg border-2 shadow-lg hover:shadow-xl transition transform hover:scale-105 ${getStatusColor()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{election.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {election.type === 'general' ? '🇮🇳 General Election' : 
             election.type === 'state' ? '🏛️ State Election' : 
             '🏘️ Local Election'}
          </p>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <span className="font-semibold text-gray-700">State:</span> {election.state || 'National'}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-gray-700">Year:</span> {election.year}
        </p>
        {election.votingDate && (
          <p className="text-sm">
            <span className="font-semibold text-gray-700">Voting Date:</span>{' '}
            {new Date(election.votingDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r">
        <span className={
          election.status === 'upcoming' ? 'text-yellow-700' :
          election.status === 'ongoing' ? 'text-red-700' :
          'text-green-700'
        }>
          {getStatusText()}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          📢 Click to view full details, timeline & polling booths
        </p>
      </div>
    </div>
  );
}
