import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { candidateService, electionService, voteService } from "../services";
import "../styles/vote.css";

const boothStages = ["collect", "ink", "evm", "success"];

export default function Vote() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [boothStage, setBoothStage] = useState("collect");
  const [voteStatus, setVoteStatus] = useState(null);
  const [results, setResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [inkApplied, setInkApplied] = useState(false);
  const [evmBeep, setEvmBeep] = useState(false);

  const isEligible = user?.isEligible !== false;

  const boothStageIndex = useMemo(
    () => boothStages.indexOf(boothStage),
    [boothStage],
  );

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const data = await electionService.getElections({ status: "ongoing" });
        setElections(data || []);
      } catch (fetchError) {
        console.error("Error fetching elections:", fetchError);
        setError("Unable to load ongoing elections.");
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const loadCandidatesAndStatus = async (electionId) => {
    setError("");
    setActionLoading(true);
    try {
      const [candidateData, statusData] = await Promise.all([
        candidateService.getCandidates(electionId),
        voteService.getStatus(electionId),
      ]);
      setCandidates(candidateData || []);
      setVoteStatus(statusData || null);

      if (statusData?.hasVoted) {
        const resultsData = await voteService.getResults(electionId);
        setResults(resultsData);
        setStep(4);
        return;
      }

      setStep(2);
    } catch (fetchError) {
      console.error("Error loading candidates:", fetchError);
      setError(fetchError?.message || "Unable to load candidates.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleElectionSelect = async (election) => {
    setSelectedElection(election);
    setSelectedCandidate(null);
    setResults(null);
    setBoothStage("collect");
    setInkApplied(false);
    setEvmBeep(false);
    await loadCandidatesAndStatus(election._id);
  };

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const proceedToBooth = () => {
    setBoothStage("collect");
    setStep(3);
  };

  const advanceBoothStage = () => {
    setBoothStage((prev) => {
      const currentIndex = boothStages.indexOf(prev);
      const nextIndex = Math.min(currentIndex + 1, boothStages.length - 1);
      return boothStages[nextIndex];
    });
  };

  const handleApplyInk = () => {
    setInkApplied(true);
    setTimeout(() => {
      advanceBoothStage();
    }, 1500);
  };

  const handleCastVoteEVM = async (candidate) => {
    setSelectedCandidate(candidate);
    setEvmBeep(true);
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close().catch(() => {});
      }, 2000);
    } catch (e) {
      console.log("Audio not supported", e);
    }

    setTimeout(async () => {
      await castVote(candidate);
      setEvmBeep(false);
    }, 2000);
  };

  const castVote = async (candidateToVoteFor = selectedCandidate) => {
    if (!selectedElection) {
      setError("Please select an election first.");
      return;
    }

    if (!candidateToVoteFor) {
      if (candidates.length === 0) {
        // Demo mode fallback when no candidates exist
        setBoothStage("success");
        setStep(4);
        return;
      }
      setError("Please select a candidate first.");
      return;
    }

    setError("");
    setActionLoading(true);
    try {
      await voteService.castVote(selectedElection._id, candidateToVoteFor._id);
      setBoothStage("success");
      const resultsData = await voteService.getResults(selectedElection._id);
      setResults(resultsData);
      setStep(4);
    } catch (voteError) {
      setError(voteError?.message || "Unable to cast vote.");
    } finally {
      setActionLoading(false);
    }
  };

  const loadResults = async () => {
    if (!selectedElection) {
      setError("Please select an election first.");
      return;
    }

    setError("");
    setResultsLoading(true);
    try {
      const resultsData = await voteService.getResults(selectedElection._id);
      setResults(resultsData);
      setStep(4);
    } catch (resultsError) {
      setError(resultsError?.message || "Unable to load results.");
    } finally {
      setResultsLoading(false);
    }
  };

  const resultsSummary = results?.results || [];
  const totalVotes = results?.totalVotes || 0;

  return (
    <div className="vote-body min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 left-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-blue-200">
                Voting Experience
              </p>
              <h1 className="vote-display text-4xl font-bold text-white sm:text-5xl">
                Cast Your Vote, Step by Step
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Follow the real-life flow: collect your ballot, walk into the booth,
                ink your finger, and press the EVM button to seal your vote.
              </p>
            </div>
            <div className="vote-panel vote-float flex items-center gap-3 rounded-3xl px-6 py-4 shadow-xl">
              <div className="text-3xl">🗳️</div>
              <div>
                <p className="text-sm text-slate-200">Logged in as</p>
                <p className="text-lg font-semibold text-white">
                  {user?.firstName || "Voter"}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-100">
              {error}
            </div>
          )}

          {!isEligible && (
            <div className="mb-6 rounded-2xl border border-yellow-400/40 bg-yellow-400/10 px-5 py-4 text-yellow-100">
              You are not eligible to vote yet. Visit the FAQ for eligibility details.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl bg-white/5 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Step 1 · Pick the Election</h2>
                {loading && <span className="text-sm text-slate-300">Loading…</span>}
              </div>

              {elections.length === 0 && !loading ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
                  No ongoing elections right now. Check announcements in
                  <button
                    type="button"
                    className="ml-2 text-blue-200 underline"
                    onClick={() => navigate("/live-elections")}
                  >
                    Live Elections
                  </button>
                  .
                </div>
              ) : step > 1 ? (
                <div className="mt-6 rounded-2xl border border-blue-400/40 bg-blue-500/10 p-5">
                  <p className="text-sm text-slate-300">Selected Election</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-white">{selectedElection?.name}</p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm font-semibold text-blue-400 hover:text-blue-300 underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {elections.map((election) => (
                    <button
                      key={election._id}
                      type="button"
                      onClick={() => handleElectionSelect(election)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        selectedElection?._id === election._id
                          ? "border-blue-400 bg-blue-500/20"
                          : "border-white/10 bg-white/5 hover:border-blue-300"
                      }`}
                    >
                      <p className="text-lg font-semibold text-white">{election.name}</p>
                      <p className="mt-1 text-sm text-slate-300">
                        {election.state || "National"} · {election.year}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-widest text-blue-200">
                        {election.status}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <aside className="rounded-3xl bg-white/5 p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white">Process Tracker</h2>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Select Election", step: 1 },
                  { label: "Select Candidate", step: 2 },
                  { label: "Booth Experience", step: 3 },
                  { label: "View Results", step: 4 },
                ].map((item) => {
                  const isCompleted = step > item.step;
                  const isCurrent = step === item.step;
                  
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                        isCompleted
                          ? "border-green-400/60 bg-green-500/10"
                          : isCurrent
                          ? "border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-500/20"
                          : "border-white/10 bg-white/5 opacity-60"
                      }`}
                    >
                      <span className={`text-sm ${isCurrent ? 'text-white font-semibold' : 'text-slate-200'}`}>
                        {item.label}
                      </span>
                      <span className="text-lg">
                        {isCompleted ? "✔" : isCurrent ? "●" : "○"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>

          <section className="mt-10 rounded-3xl bg-white/5 p-6 shadow-xl">
            {step === 2 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Step 2 · Select a Candidate</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    {actionLoading && <span>Loading…</span>}
                    <button
                      type="button"
                      onClick={loadResults}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      {resultsLoading ? "Fetching results…" : "View Live Results"}
                    </button>
                  </div>
                </div>
                {voteStatus?.hasVoted && (
                  <p className="mt-4 text-amber-200">
                    You already voted in this election.
                  </p>
                )}
                {!isEligible && (
                  <p className="mt-4 text-yellow-200">
                    You are not eligible to vote. You can still view live results.
                  </p>
                )}
                {candidates.length === 0 ? (
                  <div className="mt-6 rounded-2xl border border-yellow-400/40 bg-yellow-500/10 p-5">
                    <p className="text-yellow-200">
                      No candidates have been added to this election yet. You can still proceed to experience the booth simulation in <strong>Demo Mode</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {candidates.map((candidate) => (
                      <button
                        key={candidate._id}
                        type="button"
                        onClick={() => handleCandidateSelect(candidate)}
                        disabled={!isEligible}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          selectedCandidate?._id === candidate._id
                            ? "border-orange-400 bg-orange-500/30"
                            : "border-white/10 bg-white/5 hover:border-orange-300/50"
                        } ${!isEligible ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
                            {candidate.symbol || "★"}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-white">{candidate.name}</p>
                            <p className="text-sm text-slate-300">{candidate.party}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.3em] text-orange-200">
                            {selectedCandidate?._id === candidate._id ? "Selected" : "Tap to select"}
                          </p>
                          {selectedCandidate?._id === candidate._id && (
                            <span className="text-orange-400 text-xl">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 gap-4">
                  <p className="text-sm text-slate-400">
                    {candidates.length > 0 ? "Review the candidates above, then proceed to the booth." : ""}
                  </p>
                  <button
                    onClick={proceedToBooth}
                    className="rounded-full px-8 py-3 text-lg font-bold text-white transition-all flex items-center gap-3 w-full sm:w-auto justify-center bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 hover:bg-blue-500 active:scale-95 cursor-pointer"
                  >
                    <span>{candidates.length === 0 ? "Start Demo Booth" : "Proceed to Booth"}</span>
                    <span className="text-2xl">➔</span>
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Step 3 · Booth Experience</h2>
                  <span className="text-sm text-slate-300">Simulated flow</span>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {[
                    {
                      title: "Collect Your Ballot",
                      body: "Verify your identity and collect the voter slip.",
                      icon: "🧾",
                      stage: "collect",
                    },
                    {
                      title: "Finger Ink",
                      body: "Dip your finger in indelible ink.",
                      icon: "🖐️",
                      stage: "ink",
                    },
                    {
                      title: "EVM Button",
                      body: "Press the EVM button for your candidate.",
                      icon: "🔘",
                      stage: "evm",
                    },
                  ].map((card, index) => (
                    <div
                      key={card.title}
                      className={`rounded-2xl border px-5 py-4 ${
                        boothStageIndex >= index
                          ? "border-green-400/60 bg-green-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-3xl">{card.icon}</div>
                        <span className="text-lg">
                          {boothStageIndex > index ? "✔" : "○"}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">{card.title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{card.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-6 overflow-hidden relative min-h-[300px] flex flex-col justify-center">
                  {boothStage === "collect" && (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                      <div className="text-7xl mb-6 animate-bounce">🧾</div>
                      <h3 className="text-3xl font-bold text-white mb-3">Identity Verification</h3>
                      <p className="text-slate-300 mb-8 max-w-md mx-auto text-lg">Your identity is being verified against the electoral roll. Please collect your voter slip to proceed to the voting compartment.</p>
                      <button 
                        onClick={advanceBoothStage} 
                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(22,163,74,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto text-lg"
                      >
                        <span>Collect Voter Slip</span>
                        <span className="text-2xl">➔</span>
                      </button>
                    </div>
                  )}

                  {boothStage === "ink" && (
                    <div className="text-center py-8 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="text-7xl mb-6">🖐️</div>
                      <h3 className="text-3xl font-bold text-white mb-3">Apply Indelible Ink</h3>
                      <p className="text-slate-300 mb-10 text-lg">The polling officer will now apply indelible ink to your left forefinger.</p>
                      
                      <div className="flex justify-center mb-12">
                        <div className="relative w-24 h-40 bg-[#e8b598] rounded-t-full border-2 border-[#d0997a] flex justify-center pt-3 shadow-inner overflow-hidden">
                          {/* Nail */}
                          <div className="w-12 h-16 bg-[#f0cbb5] rounded-t-full opacity-90 border-b border-[#d0997a] absolute top-2"></div>
                          
                          {/* Ink Animation */}
                          <div className={`absolute top-0 left-0 w-full h-20 bg-purple-900/90 mix-blend-multiply transition-all duration-1000 ease-in-out transform origin-top ${inkApplied ? 'translate-y-0 opacity-100 scale-y-100' : '-translate-y-full opacity-0 scale-y-0'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 75% 100%, 0 50%)' }}></div>
                        </div>
                      </div>

                      <button 
                        onClick={handleApplyInk} 
                        disabled={inkApplied}
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/80 disabled:text-purple-300 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all transform hover:scale-105 active:scale-95 text-lg"
                      >
                        {inkApplied ? 'Ink Applied! Proceeding...' : 'Apply Ink'}
                      </button>
                    </div>
                  )}

                  {boothStage === "evm" && (
                    <div className="py-4 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-white mb-2">Cast Your Vote</h3>
                        <p className="text-slate-300">Press the blue button next to your chosen candidate.</p>
                      </div>

                      <div className="evm-machine bg-[#e2e8f0] p-4 md:p-8 rounded-xl border-[8px] border-[#94a3b8] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-2xl mx-auto relative">
                        {/* Ready Light */}
                        <div className="flex justify-between items-center bg-[#1e293b] text-white px-6 py-3 rounded-t-lg mb-6 shadow-inner">
                          <span className="font-bold tracking-widest uppercase text-lg text-slate-200">Ballot Unit</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-green-400">READY</span>
                            <div className="w-5 h-5 rounded-full bg-green-500 shadow-[0_0_15px_#22c55e] border border-green-300"></div>
                          </div>
                        </div>

                        {/* Candidate Row */}
                        <div className="bg-white border-[3px] border-slate-400 rounded-lg flex flex-col items-stretch overflow-hidden shadow-md">
                          {candidates.length > 0 ? candidates.map((candidate, idx) => (
                            <div key={candidate._id} className="flex items-stretch border-b-[3px] border-slate-400 last:border-b-0">
                              <div className="w-16 bg-slate-100 flex items-center justify-center font-bold text-slate-700 border-r-[3px] border-slate-400 text-xl">
                                {String(idx + 1).padStart(2, '0')}
                              </div>
                              <div className="flex-1 p-4 border-r-[3px] border-slate-400 flex flex-col justify-center">
                                <p className="font-bold text-xl md:text-2xl text-black leading-tight">{candidate.name}</p>
                                <p className="text-sm md:text-md text-slate-600 font-semibold mt-1">{candidate.party}</p>
                              </div>
                              <div className="w-20 md:w-24 flex items-center justify-center text-4xl md:text-5xl border-r-[3px] border-slate-400 bg-slate-50 text-slate-800">
                                {candidate.symbol || "★"}
                              </div>
                              
                              {/* EVM Red Light */}
                              <div className="w-16 md:w-20 flex items-center justify-center bg-slate-200 border-r-[3px] border-slate-400 border-l-[4px] md:border-l-[6px] border-l-slate-800">
                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-slate-600 transition-colors duration-200 ${evmBeep && selectedCandidate?._id === candidate._id ? 'bg-red-500 shadow-[0_0_25px_#ef4444]' : 'bg-[#4a0404]'}`}></div>
                              </div>
                              
                              {/* EVM Blue Button */}
                              <div className="w-20 md:w-28 bg-slate-300 flex items-center justify-center p-2 md:p-3">
                                <button 
                                  onClick={() => handleCastVoteEVM(candidate)}
                                  disabled={actionLoading || !isEligible || evmBeep}
                                  className={`w-full aspect-square rounded-full bg-blue-600 border-b-[6px] border-blue-900 shadow-lg transition-all flex items-center justify-center
                                    ${evmBeep || actionLoading ? 'opacity-90 translate-y-1.5 border-b-0' : 'hover:bg-blue-500 active:translate-y-1.5 active:border-b-0 cursor-pointer'}`}
                                >
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="flex items-stretch border-b-[3px] border-slate-400 last:border-b-0">
                              <div className="w-16 bg-slate-100 flex items-center justify-center font-bold text-slate-700 border-r-[3px] border-slate-400 text-xl">
                                01
                              </div>
                              <div className="flex-1 p-4 border-r-[3px] border-slate-400 flex flex-col justify-center">
                                <p className="font-bold text-xl md:text-2xl text-black leading-tight">Demo Candidate</p>
                                <p className="text-sm md:text-md text-slate-600 font-semibold mt-1">Demo Party</p>
                              </div>
                              <div className="w-20 md:w-24 flex items-center justify-center text-4xl md:text-5xl border-r-[3px] border-slate-400 bg-slate-50 text-slate-800">
                                ★
                              </div>
                              
                              {/* EVM Red Light */}
                              <div className="w-16 md:w-20 flex items-center justify-center bg-slate-200 border-r-[3px] border-slate-400 border-l-[4px] md:border-l-[6px] border-l-slate-800">
                                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-slate-600 transition-colors duration-200 ${evmBeep ? 'bg-red-500 shadow-[0_0_25px_#ef4444]' : 'bg-[#4a0404]'}`}></div>
                              </div>
                              
                              {/* EVM Blue Button */}
                              <div className="w-20 md:w-28 bg-slate-300 flex items-center justify-center p-2 md:p-3">
                                <button 
                                  onClick={() => handleCastVoteEVM(null)}
                                  disabled={actionLoading || !isEligible || evmBeep}
                                  className={`w-full aspect-square rounded-full bg-blue-600 border-b-[6px] border-blue-900 shadow-lg transition-all flex items-center justify-center
                                    ${evmBeep || actionLoading ? 'opacity-90 translate-y-1.5 border-b-0' : 'hover:bg-blue-500 active:translate-y-1.5 active:border-b-0 cursor-pointer'}`}
                                >
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-8 text-center bg-slate-300/50 py-2 rounded">
                          <p className="text-sm text-slate-600 font-bold uppercase tracking-[0.2em]">Election Commission</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {boothStage === "success" && (
                    <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#22c55e]">
                        <span className="text-5xl text-white">✓</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">Vote Cast Successfully!</h3>
                      <p className="text-slate-300 text-lg">Your vote has been securely recorded.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 4 && results && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Step 4 · Results</h2>
                  <span className="text-sm text-slate-300">Total Votes: {totalVotes}</span>
                </div>

                {resultsSummary.length === 0 ? (
                  <p className="mt-6 text-slate-300">
                    Results will appear once candidates are added to this election.
                  </p>
                ) : (
                  <div className="mt-6 grid gap-4">
                    {resultsSummary.map((candidate) => {
                      const percentage = totalVotes
                        ? Math.round((candidate.votes / totalVotes) * 100)
                        : 0;

                      return (
                        <div
                          key={candidate._id}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">
                                {candidate.symbol || "★"}
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-white">{candidate.name}</p>
                                <p className="text-sm text-slate-300">{candidate.party}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-white">{candidate.votes} votes</p>
                              <p className="text-sm text-slate-400">{percentage}%</p>
                            </div>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-white/10">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-orange-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/live-elections")}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Back to Live Elections
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
