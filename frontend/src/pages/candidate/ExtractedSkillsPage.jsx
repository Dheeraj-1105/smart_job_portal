import { useState, useEffect } from 'react';
import candidateService from '../../services/candidateService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Sparkles, BookOpen, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export default function ExtractedSkillsPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await candidateService.getProfile();
                setProfile(data);
            } catch (e) {
                console.log('No profile found');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-400 animate-pulse">Loading AI Profile...</div>;
    }

    if (!profile) {
        return (
            <div className="text-center py-20">
                <div className="mb-6 inline-flex bg-white/5 p-4 rounded-full">
                    <Sparkles className="w-10 h-10 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
                <p className="text-slate-400 mb-6">You haven't uploaded a resume yet to generate your AI profile.</p>
                <Button asChild>
                    <Link to="/candidate/upload-resume">Upload Resume</Link>
                </Button>
            </div>
        );
    }

    const skillsList = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    AI Extracted Profile
                </h1>
                <Badge variant="success">Active Match Engine</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Extracted Skills</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-indigo-500/10 border-indigo-500/20 text-indigo-300">
                                {skill}
                            </Badge>
                        ))}
                        {skillsList.length === 0 && <span className="text-slate-400">No skills identified.</span>}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-slate-400" /> Professional Experience
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-lg border border-white/5">
                        {profile.experience || 'No experience identified.'}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-400" /> Education
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-lg border border-white/5">
                        {profile.education || 'No education identified.'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
