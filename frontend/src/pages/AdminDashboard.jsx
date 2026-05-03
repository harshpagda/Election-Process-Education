import React, { useEffect, useState } from "react";
import { electionService, voteService, candidateService } from "../services";
import { useAuthStore } from "../store";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [elections, setElections] = useState([]);
  const [winners, setWinners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "" });
  const [electionForm, setElectionForm] = useState({ name: "", type: "general", year: new Date().getFullYear(), state: "All", description: "" });
  const [candidateForm, setCandidateForm] = useState({ name: "", party: "", symbol: "★", constituency: "" });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const data = await electionService.getElections({});
      setElections(data || []);
      
      // Fetch winners for all elections
      const winnersData = {};
      await Promise.all(
        (data || []).map(async (election) => {
          try {
            const resultsData = await voteService.getResults(election._id);
            if (resultsData?.results && resultsData.results.length > 0) {
              const sorted = [...resultsData.results].sort((a, b) => b.votes - a.votes);
              // Only consider a winner if there's at least one vote
              if (sorted[0].votes > 0) {
                winnersData[election._id] = sorted[0];
              }
            }
          } catch (e) {
            // Might error if no candidates or no votes
          }
        })
      );
      setWinners(winnersData);
    } catch (err) {
      setError("Failed to load elections.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleToggleStatus = async (electionId, currentStatus) => {
    try {
      const newStatus = currentStatus === "upcoming" ? "ongoing" : currentStatus === "ongoing" ? "completed" : "upcoming";
      await electionService.updateElection(electionId, { status: newStatus });
      fetchElections();
      showSuccess(`Status changed to ${newStatus}`);
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleToggleResults = async (electionId, currentResultsDeclared) => {
    try {
      await electionService.updateElection(electionId, { resultsDeclared: !currentResultsDeclared });
      fetchElections();
      showSuccess(currentResultsDeclared ? "Results hidden" : "Results declared successfully!");
    } catch (err) {
      setError("Failed to update results status");
    }
  };

  const handleOpenAnnouncement = (election) => {
    setSelectedElection(election);
    setAnnouncementForm({ title: "", content: "" });
    setAnnouncementModalOpen(true);
  };

  const handleOpenCandidate = (election) => {
    setSelectedElection(election);
    setCandidateForm({ name: "", party: "", symbol: "★", constituency: "" });
    setCandidateModalOpen(true);
  };

  const handleSubmitAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await electionService.addAnnouncement(selectedElection._id, announcementForm);
      setAnnouncementModalOpen(false);
      fetchElections();
      showSuccess("Announcement added successfully!");
    } catch (err) {
      setError("Failed to add announcement");
    }
  };

  const handleSubmitElection = async (e) => {
    e.preventDefault();
    try {
      await electionService.createElection(electionForm);
      setCreateModalOpen(false);
      setElectionForm({ name: "", type: "general", year: new Date().getFullYear(), state: "All", description: "" });
      fetchElections();
      showSuccess("Election created successfully!");
    } catch (err) {
      setError("Failed to create election");
    }
  };

  const handleSubmitCandidate = async (e) => {
    e.preventDefault();
    try {
      await candidateService.createCandidate({
        ...candidateForm,
        election: selectedElection._id
      });
      setCandidateModalOpen(false);
      showSuccess(`Candidate ${candidateForm.name} added successfully!`);
    } catch (err) {
      setError("Failed to add candidate");
    }
  };

  if (user?.role !== "admin") {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Create Election
          </button>
        </div>

        {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}
        {success && <div className="mb-6 rounded-md bg-green-50 p-4 text-green-700">{success}</div>}

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-800">Manage Elections</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <p className="text-slate-500">Loading elections...</p>
            ) : elections.length === 0 ? (
              <p className="text-slate-500">No elections found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Results Declared</th>
                      <th className="px-4 py-3 font-medium">Current Winner</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {elections.map((election) => (
                      <tr key={election._id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">{election.name}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            election.status === "ongoing" ? "bg-green-100 text-green-800" :
                            election.status === "completed" ? "bg-slate-100 text-slate-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {election.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            election.resultsDeclared ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {election.resultsDeclared ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {winners[election._id] ? (
                            <span className="font-semibold text-green-700">🏆 {winners[election._id].name} ({winners[election._id].votes} votes)</span>
                          ) : (
                            <span className="text-slate-500 italic">No votes yet</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(election._id, election.status)}
                              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Toggle Status
                            </button>
                            {election.status !== "upcoming" && (
                              <button
                                onClick={() => handleToggleResults(election._id, election.resultsDeclared)}
                                className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                              >
                                {election.resultsDeclared ? "Hide Results" : "Declare Results"}
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenAnnouncement(election)}
                              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                            >
                              + Announcement
                            </button>
                            {election.status !== "completed" && (
                              <button
                                onClick={() => handleOpenCandidate(election)}
                                className="rounded bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
                              >
                                + Candidate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Add Announcement</h3>
            <p className="mb-4 text-sm text-slate-500">For election: {selectedElection?.name}</p>
            
            <form onSubmit={handleSubmitAnnouncement}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Voting Extended"
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
                <textarea
                  required
                  rows="4"
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Details about the announcement..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Election Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Create New Election</h3>
            
            <form onSubmit={handleSubmitElection}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  required
                  value={electionForm.name}
                  onChange={(e) => setElectionForm({...electionForm, name: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., General Election 2026"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                  <select
                    value={electionForm.type}
                    onChange={(e) => setElectionForm({...electionForm, type: e.target.value})}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="state">State</option>
                    <option value="local">Local</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Year</label>
                  <input
                    type="number"
                    required
                    value={electionForm.year}
                    onChange={(e) => setElectionForm({...electionForm, year: parseInt(e.target.value)})}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">State / Region</label>
                <input
                  type="text"
                  required
                  value={electionForm.state}
                  onChange={(e) => setElectionForm({...electionForm, state: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows="3"
                  value={electionForm.description}
                  onChange={(e) => setElectionForm({...electionForm, description: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {candidateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-slate-900">Add Candidate</h3>
            <p className="mb-4 text-sm text-slate-500">For election: {selectedElection?.name}</p>
            
            <form onSubmit={handleSubmitCandidate}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-slate-700">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Party Name</label>
                  <input
                    type="text"
                    required
                    value={candidateForm.party}
                    onChange={(e) => setCandidateForm({...candidateForm, party: e.target.value})}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., Democratic Party"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Symbol (Emoji)</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={candidateForm.symbol}
                    onChange={(e) => setCandidateForm({...candidateForm, symbol: e.target.value})}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 🐘, ✋, 🪷"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-slate-700">Constituency (Optional)</label>
                <input
                  type="text"
                  value={candidateForm.constituency}
                  onChange={(e) => setCandidateForm({...candidateForm, constituency: e.target.value})}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., North District"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCandidateModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
