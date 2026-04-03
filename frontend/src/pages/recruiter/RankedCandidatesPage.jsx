import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import candidateService from '../../services/candidateService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Trophy, FileText, ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function RankedCandidatesPage() {
    const { jobId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchRanked = async () => {
             try {
                 const data = await candidateService.getRankedCandidates(jobId);
                 setCandidates(data);
             } catch (error) {
                 console.error("Error fetching ranked candidates", error);
                 const msg = getApiErrorMessage(error, 'Failed to load ranked candidates.');
                 showToast({ type: 'error', title: 'Load Failed', message: msg });
             } finally {
                 setLoading(false);
             }
        };
        fetchRanked();
    }, [jobId]);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-white/10 gap-4">
                <div className="space-y-1">
                    <Button variant="link" asChild className="p-0 h-auto text-slate-400 mb-2">
                        <Link to="/recruiter/dashboard"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard</Link>
                    </Button>
                    <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        AI Ranked Matches
                    </h1>
                </div>
            </header>

            <Card className="border-yellow-500/20 bg-gradient-to-bl from-yellow-500/5 to-transparent">
                <CardHeader>
                    <CardTitle>Leaderboard (Job #{jobId})</CardTitle>
                    <CardDescription>Candidates scored and ranked based on TF-IDF + Cosine Similarity matching.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 animate-pulse">Loading Leaderboard...</div>
                    ) : candidates.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            No ranked candidates. Have you run the matching engine yet?
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Rank</TableHead>
                                    <TableHead>Candidate Name</TableHead>
                                    <TableHead className="max-w-md hidden md:table-cell">Relevant Skills</TableHead>
                                    <TableHead className="text-right">Match Score</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidates.map((c, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-sm ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50' : idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-600/50' : 'bg-white/5 text-slate-400'}`}>
                                                #{idx + 1}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-200">{c.candidateName}</TableCell>
                                        <TableCell className="max-w-md hidden md:table-cell text-xs text-slate-400 truncate">
                                            {c.extractedSkills}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={c.matchScore >= 80 ? 'success' : c.matchScore >= 50 ? 'warning' : 'destructive'} className="text-sm">
                                                {c.matchScore}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {c.resumeUrl ? (
                                                <Button variant="outline" size="sm" asChild>
                                                    <a href={c.resumeUrl} target="_blank" rel="noreferrer">
                                                        <FileText className="w-4 h-4 mr-2" /> Resume
                                                    </a>
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" disabled>
                                                    <FileText className="w-4 h-4 mr-2" /> No Resume
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
