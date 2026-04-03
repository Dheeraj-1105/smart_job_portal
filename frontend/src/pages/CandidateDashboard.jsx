import { useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/apiError';

export default function CandidateDashboard() {
    const { user, logout } = useContext(AuthContext);
    const { showToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/candidate/profile');
            setProfile(res.data);
        } catch (e) {
            console.log('No profile uploaded yet.');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/api/candidate/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data);
            setFile(null);
            showToast({ type: 'success', title: 'Resume uploaded', message: 'Your profile has been updated.' });
        } catch (error) {
            const msg = getApiErrorMessage(error, 'Error uploading or parsing resume.');
            showToast({ type: 'error', title: 'Upload Failed', message: msg });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 relative overflow-hidden">
            {/* Bg decoration */}
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <header className="flex justify-between items-center pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Candidate Portal
                        </h1>
                        <p className="text-slate-400 mt-1">Manage your resume profile, {user?.name}</p>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-slate-300">
                        Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Upload Section */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl h-fit">
                        <h2 className="text-xl font-semibold mb-6 text-slate-200">Upload New Resume</h2>
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="border-2 border-dashed border-white/20 hover:border-violet-500/50 transition-colors rounded-xl p-8 text-center bg-black/20">
                                <input
                                    type="file"
                                    accept=".pdf,.docx"
                                    onChange={e => setFile(e.target.files[0])}
                                    className="hidden"
                                    id="resume-upload"
                                />
                                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                                    <span className="text-4xl mb-3">📄</span>
                                    <span className="text-slate-300 font-medium">Click to select PDF/DOCX</span>
                                    <span className="text-sm text-slate-500 mt-1">{file ? file.name : 'Max file size 5MB'}</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!file || isUploading}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:grayscale flex justify-center items-center"
                            >
                                {isUploading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> AI is Parsing...</>
                                ) : 'Upload & Parse Resume'}
                            </button>
                        </form>
                    </div>

                    {/* Profile Section */}
                    <div className="p-8 bg-black/20 border border-white/5 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-6 flex justify-between items-center text-slate-200">
                            AI Extracted Profile
                            {profile && <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">Active</span>}
                        </h2>

                        {!profile ? (
                            <div className="text-center py-12 text-slate-500 text-sm">
                                No active profile. <br />Upload a resume to let our AI extract your skills.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Key Skills</h3>
                                    <div className="mt-2 text-slate-200 bg-white/5 p-4 rounded-lg border border-white/5 leading-relaxed text-sm">
                                        {profile.skills}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Experience SUMMARY</h3>
                                    <div className="mt-2 text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-lg border border-white/5">
                                        {profile.experience || 'None extracted.'}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Education</h3>
                                    <div className="mt-2 text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                                        {profile.education || 'None extracted.'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
