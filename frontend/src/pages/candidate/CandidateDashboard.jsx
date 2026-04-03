import { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { StatsCard } from '../../components/StatsCard';
import { FileText, Briefcase, FileCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function CandidateDashboard() {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();
    const [stats, setStats] = useState({ applications: 0, hasProfile: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, appsRes] = await Promise.allSettled([
                    api.get('/api/candidate/profile'),
                    api.get('/api/candidate/applications')
                ]);
                
                setStats({
                    hasProfile: profileRes.status === 'fulfilled' && !!profileRes.value.data,
                    applications: appsRes.status === 'fulfilled' ? appsRes.value.data.length : 0
                });
            } catch (error) {
                console.error("Error fetching stats", error);
                const msg = getApiErrorMessage(error, 'Failed to load dashboard stats.');
                showToast({ type: 'error', title: 'Load Failed', message: msg });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-400 animate-pulse">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-slate-400 mt-2">Here's your job search overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="AI Profile" 
                    value={stats.hasProfile ? "Active" : "Missing"} 
                    icon={Sparkles} 
                    description={stats.hasProfile ? "Matching running" : "Upload resume"} 
                    className={stats.hasProfile ? "border-indigo-500/30" : "border-amber-500/30"}
                />
                <StatsCard 
                    title="Applications" 
                    value={stats.applications.toString()} 
                    icon={FileCheck} 
                    description="Total jobs applied" 
                />
                <StatsCard 
                    title="Job Alerts" 
                    value="0" 
                    icon={Briefcase} 
                    description="New matching jobs" 
                />
                <StatsCard 
                    title="Profile Views" 
                    value="0" 
                    icon={FileText} 
                    description="By recruiters this week" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {!stats.hasProfile && (
                    <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <Sparkles className="w-12 h-12 text-indigo-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Get AI Matched!</h3>
                            <p className="text-slate-300 mb-6">Upload your resume and let our AI engine find the perfect jobs for your skills.</p>
                            <Button asChild>
                                <Link to="/candidate/upload-resume">Upload Resume Now</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
