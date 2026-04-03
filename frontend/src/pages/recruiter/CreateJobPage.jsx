import { useState } from 'react';
import jobService from '../../services/jobService';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function CreateJobPage() {
    const [formData, setFormData] = useState({ title: '', description: '', requiredSkills: '', experienceRequired: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await jobService.createJob(formData);
            showToast({ type: 'success', title: 'Job created', message: 'Your job has been posted.' });
            navigate('/recruiter/dashboard');
        } catch (error) {
            console.error(error);
            const msg = getApiErrorMessage(error, 'Error creating job.');
            showToast({ type: 'error', title: 'Create Failed', message: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <header className="flex justify-between items-center pb-4 border-b border-white/10">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <PlusCircle className="w-8 h-8 text-violet-400" />
                    Create New Job
                </h1>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>Fill out the job requirements. AI uses these to rank candidates.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Job Title</label>
                            <Input 
                                required 
                                placeholder="e.g. Senior Frontend Engineer" 
                                value={formData.title} 
                                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea 
                                required 
                                placeholder="Brief job description..." 
                                className="w-full flex min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                                value={formData.description} 
                                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">Required Skills</label>
                                <Input 
                                    required 
                                    placeholder="React, Tailwind, Node (comma separated)" 
                                    value={formData.requiredSkills} 
                                    onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">Experience Required (Years)</label>
                                <Input 
                                    required 
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 5" 
                                    value={formData.experienceRequired} 
                                    onChange={e => setFormData({ ...formData, experienceRequired: e.target.value })} 
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 mt-4 bg-violet-600 hover:bg-violet-500 shadow-violet-500/30">
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Publishing Job...</>
                            ) : 'Publish Job Posting'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
