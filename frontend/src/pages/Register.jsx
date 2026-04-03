import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/apiError';
import { useToast } from '../context/ToastContext';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CANDIDATE' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.name.trim()) {
            const msg = 'Name is required.';
            setError(msg);
            showToast({ type: 'error', title: 'Validation Error', message: msg });
            return;
        }
        if (!emailRegex.test(formData.email)) {
            const msg = 'Please enter a valid email address.';
            setError(msg);
            showToast({ type: 'error', title: 'Validation Error', message: msg });
            return;
        }
        if (!formData.password) {
            const msg = 'Password is required.';
            setError(msg);
            showToast({ type: 'error', title: 'Validation Error', message: msg });
            return;
        }
        if (!['CANDIDATE', 'RECRUITER'].includes(formData.role)) {
            const msg = 'Please select a role.';
            setError(msg);
            showToast({ type: 'error', title: 'Validation Error', message: msg });
            return;
        }
        setIsLoading(true);
        try {
            console.log('[REGISTER] Request payload:', { ...formData, password: '***' });
            const role = await register(formData.name, formData.email, formData.password, formData.role);
            console.log('[REGISTER] Response role:', role);
            if (role === 'CANDIDATE') navigate('/candidate/dashboard');
            else navigate('/recruiter/dashboard');
            showToast({ type: 'success', title: 'Registration complete', message: 'Your account is ready.' });
        } catch (err) {
            console.log('[REGISTER] Error:', err);
            const msg = getApiErrorMessage(err, 'Registration failed. Please try again.');
            setError(msg);
            showToast({ type: 'error', title: 'Registration Failed', message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full" />

            <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl z-10 shadow-2xl">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Create Account
                </h2>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-slate-500"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-slate-500"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all text-white placeholder-slate-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                                className={`py-3 px-4 rounded-lg border transition-all ${formData.role === 'CANDIDATE' ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'bg-black/20 border-white/10 text-slate-400 hover:bg-white/5'}`}
                            >
                                Candidate
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                                className={`py-3 px-4 rounded-lg border transition-all ${formData.role === 'RECRUITER' ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' : 'bg-black/20 border-white/10 text-slate-400 hover:bg-white/5'}`}
                            >
                                Recruiter
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 flex justify-center"
                    >
                        {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
