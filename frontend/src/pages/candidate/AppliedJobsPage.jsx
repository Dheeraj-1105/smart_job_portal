import { useState, useEffect } from 'react';
import applicationService from '../../services/applicationService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { FileCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function AppliedJobsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await applicationService.getApplications();
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications", error);
                const msg = getApiErrorMessage(error, 'Failed to load applications.');
                showToast({ type: 'error', title: 'Load Failed', message: msg });
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-indigo-400" />
                    My Applications
                </h1>
            </div>

            {loading ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">Loading applications...</div>
            ) : applications.length === 0 ? (
                <div className="text-center py-20 text-slate-400 bg-white/5 border border-white/10 rounded-2xl">
                    You haven't applied to any jobs yet.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Match Score</TableHead>
                            <TableHead>Rank</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium text-slate-200">
                                    {/* Handle if backend returns nested job or flat jobTitle */}
                                    {app.job?.title || app.jobTitle || `Job #${app.jobId || app.job_id}`}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">Applied</Badge>
                                </TableCell>
                                <TableCell>
                                    {app.score === null || app.score === undefined ? (
                                        <span className="text-slate-500 text-sm italic">Pending AI Match</span>
                                    ) : (
                                        <Badge variant={app.score > 70 ? "success" : "warning"}>
                                            {Number(app.score).toFixed(0)}%
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {app.ranking ? `#${app.ranking}` : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
