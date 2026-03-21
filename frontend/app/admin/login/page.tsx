'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Code2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
      toast.success('Welcome back! 🚀');
      router.push('/admin');
    } catch {
      toast.error('Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)',
        }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }} className="glass-card p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Code2 size={28} color="white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Login to your portfolio dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Username or Email</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="johndoe or you@example.com" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPass ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
              </button>
            </div>
          </div>
          <motion.button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : 'Login to Dashboard'}
          </motion.button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold hover:text-purple-400 transition-colors" style={{ color: '#a78bfa' }}>
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
