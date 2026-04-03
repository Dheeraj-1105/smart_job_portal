import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import candidateService from '../../services/candidateService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';

export default function UploadResumePage() {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        try {
            await candidateService.uploadResume(file);
            showToast({ type: 'success', title: 'Resume uploaded', message: 'AI is processing your resume.' });
            navigate('/candidate/skills');
        } catch (error) {
            const msg = getApiErrorMessage(error, 'Error uploading or parsing resume.');
            showToast({ type: 'error', title: 'Upload Failed', message: msg });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Upload Resume</CardTitle>
                    <CardDescription>Upload your resume to let our AI extract your skills and experience.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-white/20 hover:border-indigo-500/50 transition-colors rounded-xl p-10 text-center bg-black/20 group cursor-pointer relative">
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={e => setFile(e.target.files[0])}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                id="resume-upload"
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                                <UploadCloud className="w-12 h-12 text-slate-400 group-hover:text-indigo-400 mb-4 transition-colors" />
                                <span className="text-slate-300 font-medium">Click or drag & drop</span>
                                <span className="text-sm text-slate-500 mt-1">PDF or DOCX (Max 5MB)</span>
                            </div>
                        </div>
                        
                        {file && (
                           <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center justify-between text-sm text-indigo-200">
                               <span className="truncate max-w-[80%]">{file.name}</span>
                               <span className="text-indigo-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                           </div> 
                        )}

                        <Button
                            type="submit"
                            disabled={!file || isUploading}
                            className="w-full"
                        >
                            {isUploading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Resume...</>
                            ) : 'Upload & Extract Details'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
