import { useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/apiError';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function RecruiterDashboard() {
    const { user, logout } = useContext(AuthContext);
    const { showToast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', requiredSkills: '', experienceRequired: '' });
    const [selectedJob, setSelectedJob] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [isMatching, setIsMatching] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/api/recruiter/jobs');
            setJobs(res.data);
        } catch (error) {
            const msg = getApiErrorMessage(error, 'Failed to load jobs.');
            showToast({ type: 'error', title: 'Load Failed', message: msg });
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/recruiter/jobs', formData);
            showToast({ type: 'success', title: 'Job created', message: 'Your job posting is live.' });
            setShowForm(false);
            setFormData({ title: '', description: '', requiredSkills: '', experienceRequired: '' });
            fetchJobs();
        } catch (error) {
            const msg = getApiErrorMessage(error, 'Error creating job.');
            showToast({ type: 'error', title: 'Create Failed', message: msg });
        }
    };

    const fetchRankedCandidates = async (jobId) => {
        try {
            const res = await api.get(`/api/recruiter/rank/${jobId}`);
            setCandidates(res.data);
            setSelectedJob(jobs.find(j => j.id === jobId));
        } catch (error) {
            const msg = getApiErrorMessage(error, 'Failed to load candidates.');
            showToast({ type: 'error', title: 'Load Failed', message: msg });
        }
    };

    const runMatching = async (jobId) => {
        setIsMatching(true);
        try {
            await api.post(`/api/match/run/${jobId}`);
            showToast({ type: 'success', title: 'Matching complete', message: 'AI ranking updated.' });
            fetchRankedCandidates(jobId);
        } catch (error) {
            const msg = getApiErrorMessage(error, 'Error running matching engine.');
            showToast({ type: 'error', title: 'Match Failed', message: msg });
        } finally {
            setIsMatching(false);
        }
    };

    const chartData = {
        labels: candidates.slice(0, 10).map(c => c.candidateName.split(' ')[0]),
        datasets: [
            {
                label: 'Match Score (%)',
                data: candidates.slice(0, 10).map(c => c.matchScore),
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
        },
        plugins: {
            legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } }
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Recruiter Dashboard
                        </h1>
                        <p className="text-slate-400 mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-slate-300">
                        Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Jobs List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-slate-200">Your Jobs</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="p-2 bg-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500/30 transition-colors border border-violet-500/50"
                            >
                                + New Job
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleCreateJob} className="p-5 bg-white/5 border border-white/10 rounded-xl space-y-4">
                                <input required placeholder="Job Title" className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                <textarea required placeholder="Required Skills (comma separated)" className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white h-20" value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} />
                                <input required placeholder="Experience (e.g. 3 years)" className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white" value={formData.experienceRequired} onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })} />
                                <button type="submit" className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded text-white font-medium text-sm transition-colors">Post Job</button>
                            </form>
                        )}

                        <div className="space-y-3">
                            {jobs.map(job => (
                                <div
                                    key={job.id}
                                    onClick={() => fetchRankedCandidates(job.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?.id === job.id ? 'bg-violet-500/10 border-violet-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <h3 className="font-medium text-slate-200">{job.title}</h3>
                                    <p className="text-xs text-slate-400 mt-1 truncate">{job.requiredSkills}</p>
                                </div>
                            ))}
                            {jobs.length === 0 && !showForm && (
                                <div className="text-center p-8 bg-white/5 rounded-xl border border-white/5 text-slate-500 text-sm">
                                    No jobs posted yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: AI Ranking Dashboard */}
                    <div className="lg:col-span-2 space-y-6">
                        {!selectedJob ? (
                            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                                <p className="text-slate-500 font-medium">Select a job to view AI candidate rankings.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{selectedJob.title} Candidates</h2>
                                        <p className="text-sm text-slate-400 mt-1">Required: {selectedJob.requiredSkills}</p>
                                    </div>
                                    <button
                                        onClick={() => runMatching(selectedJob.id)}
                                        disabled={isMatching}
                                        className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 rounded-lg text-white font-medium shadow-lg shadow-violet-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
                                    >
                                        {isMatching ? 'Processing Resumes...' : 'Run AI Matcher'}
                                    </button>
                                </div>

                                {candidates.length > 0 && (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {/* Chart Data */}
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                            <h3 className="text-lg font-medium mb-4 text-slate-200">Score Distribution</h3>
                                            <Bar data={chartData} options={chartOptions} />
                                        </div>

                                        {/* Leaderboard */}
                                        <div className="space-y-3">
                                            {candidates.map((candidate, idx) => (
                                                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50' : idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-600/50' : 'bg-white/5 text-slate-400'}`}>
                                                            #{idx + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-slate-200">{candidate.candidateName}</h4>
                                                            <p className="text-xs text-slate-400 truncate w-48">{candidate.extractedSkills}</p>
                                                            <a href="#" className="text-xs text-violet-400 hover:underline mt-1 block">View Resume file</a>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-xl font-bold ${candidate.matchScore >= 80 ? 'text-green-400' : candidate.matchScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                            {candidate.matchScore}%
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Match</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {candidates.length === 0 && (
                                    <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
                                        <p className="text-slate-400">No candidates have been ranked yet.</p>
                                        <p className="text-sm text-slate-500 mt-2">Click "Run AI Matcher" to analyze all candidate resumes against this job's required skills.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
