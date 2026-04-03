import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import candidateService from '../../services/candidateService';
import matchingService from '../../services/matchingService';
import { CandidateCard } from '../../components/CandidateCard';
import { Button } from '../../components/ui/Button';
import { Sparkles, Users } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function ViewCandidatesPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMatching, setIsMatching] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                // Warning: The prompt dictates this endpoint:
                // GET /api/recruiter/candidates/{jobId}
                // (In existing backend it might just return the ApplicationResponse list or Candidate list)
                const data = await candidateService.getApplicantsForJob(jobId);
                const normalized = Array.isArray(data)
                    ? data.map((item) => {
                        if (item && item.candidateId) {
                            return {
                                candidate: {
                                    id: item.candidateId,
                                    name: `Candidate #${item.candidateId}`,
                                    skills: '',
                                    experience: 0
                                },
                                score: item.score
                            };
                        }
                        return item;
                    })
                    : [];
                setCandidates(normalized);
            } catch (error) {
                console.error("Error fetching candidates", error);
                const msg = getApiErrorMessage(error, 'Failed to load candidates.');
                showToast({ type: 'error', title: 'Load Failed', message: msg });
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, [jobId]);

    const handleRunMatch = async () => {
        setIsMatching(true);
        try {
            await matchingService.runMatching(jobId);
            // After successful match, redirect to the Ranked Candidates view
            navigate(`/recruiter/ranked/${jobId}`);
        } catch (error) {
            console.error("Error running match", error);
            const msg = getApiErrorMessage(error, 'Error running the matching engine.');
            showToast({ type: 'error', title: 'Match Failed', message: msg });
        } finally {
            setIsMatching(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-white/10 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Users className="w-8 h-8 text-fuchsia-400" />
                    Unranked Candidates (Job ID: {jobId})
                </h1>
                <Button 
                    onClick={handleRunMatch}
                    disabled={isMatching || candidates.length === 0}
                    className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 shadow-violet-500/20 shadow-lg text-white"
                >
                    {isMatching ? 'Processing...' : <><Sparkles className="w-4 h-4 mr-2" /> Run AI Matcher</>}
                </Button>
            </header>

            {loading ? (
                <div className="p-8 text-slate-400 animate-pulse text-center">Loading Candidates...</div>
            ) : candidates.length === 0 ? (
                <div className="p-16 text-center bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-slate-400">No candidates have applied yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* The endpoint might return Application objects or Candidate objects. 
                        Assume it returns candidates flatly or we adapt gracefully */}
                    {candidates.map((candidate, idx) => {
                        const c = candidate.candidate || candidate;
                        const score = candidate.score ?? candidate.matchScore;
                        return (
                            <CandidateCard key={c.id || idx} candidate={c} appliedJobScore={score} />
                        )
                    })}
                </div>
            )}
        </div>
    );
}
