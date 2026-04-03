import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import jobService from '../../services/jobService';
import { StatsCard } from '../../components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart3, Users, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function RecruiterDashboard() {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
             try {
                 const data = await jobService.getRecruiterJobs();
                 setJobs(data);
             } catch (e) {
                 console.error("Error fetching jobs", e);
             } finally {
                 setLoading(false);
             }
        };
        fetchDashboardData();
    }, []);

    // Placeholder charting
    const chartData = {
        labels: jobs.slice(0, 5).map(j => j.title),
        datasets: [
            {
                label: 'Applicants',
                data: jobs.slice(0, 5).map(() => Math.floor(Math.random() * 50) + 10), // Mock data as apps per job endpoint isn't defined explicitly as aggregation yet
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } } },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } },
            x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.7)' } }
        }
    };

    if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading Recruiter Data...</div>;

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Recruiter Overview
                </h1>
                <p className="text-slate-400 mt-2">Welcome back, {user?.name}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Total Jobs Posted" value={jobs.length} icon={Briefcase} description="Active listings" />
                <StatsCard title="Total Candidates" value="142" icon={Users} description="Across all jobs (System mock)" />
                <StatsCard title="Applications" value="328" icon={TrendingUp} description="Received this month" />
                <StatsCard title="AI Matches run" value="12" icon={BarChart3} description="Candidate rankings" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                     <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Recent Job Postings</CardTitle>
                            <CardDescription>Manage your latest opening and review candidates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {jobs.slice(0, 4).map(job => (
                                    <div key={job.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-slate-200">{job.title}</h3>
                                            <p className="text-xs text-slate-400 mt-1">{job.requiredSkills}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm" asChild>
                                                 <Link to={`/recruiter/candidates/${job.id}`}>View Applicants</Link>
                                            </Button>
                                            <Button size="sm" asChild>
                                                 <Link to={`/recruiter/ranked/${job.id}`}>Rankings</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {jobs.length === 0 && (
                                    <div className="text-center py-6 text-slate-400">No jobs posted yet.</div>
                                )}
                            </div>
                        </CardContent>
                     </Card>
                </div>
                
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Quick Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
