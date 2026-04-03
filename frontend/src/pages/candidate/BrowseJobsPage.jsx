import { useState, useEffect } from 'react';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService';
import { JobCard } from '../../components/JobCard';
import { Input } from '../../components/ui/Input';
import { Briefcase, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function BrowseJobsPage() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all jobs
                const jobsData = await jobService.getAllJobs();
                // Fetch candidate applications to know what they already applied for
                const appsData = await applicationService.getApplications();
                
                setJobs(jobsData);
                
                const appliedSet = new Set(appsData.map(app => app.jobId));
                setAppliedJobs(appliedSet);
            } catch (error) {
                console.error("Error fetching jobs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleApply = async (jobId) => {
        try {
            await applicationService.applyToJob(jobId);
            setAppliedJobs(prev => new Set([...prev, jobId]));
            showToast({ type: 'success', title: 'Application submitted', message: 'You have applied successfully.' });
        } catch (error) {
            console.error(error);
            const msg = getApiErrorMessage(error, 'Error applying. Have you uploaded a resume?');
            showToast({ type: 'error', title: 'Apply Failed', message: msg });
        }
    };

    const filteredJobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(search.toLowerCase()) || 
        job.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-indigo-400" />
                    Browse Jobs
                </h1>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                        placeholder="Search jobs..." 
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-slate-400 animate-pulse">Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    No jobs found matching your search.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onApply={handleApply} 
                            applied={appliedJobs.has(job.id)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
