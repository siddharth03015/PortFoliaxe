'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Code2, Mail, UserPlus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.username || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to PortfolioGen 🚀');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--bg-secondary)', border: '1px solid var(--border-card)',
    color: 'var(--text-primary)', borderRadius: 12, padding: '0.75rem 1rem 0.75rem 2.75rem',
    width: '100%', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
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
            Create <span className="gradient-text">Account</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Start building your portfolio today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="John Doe" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
            <div className="relative">
              <UserPlus size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="johndoe" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })} style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Your portfolio will be at /portfolio/{form.username || 'username'}</p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: '3rem' }}
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
                Creating Account...
              </span>
            ) : (
              <>
                <UserPlus size={16} /> Create Account
              </>
            )}
          </motion.button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/admin/login" className="font-semibold hover:text-purple-400 transition-colors" style={{ color: '#a78bfa' }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
