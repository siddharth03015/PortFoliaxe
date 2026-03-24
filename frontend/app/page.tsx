'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Sparkles, Rocket, Shield, Globe, Code2, ArrowRight, Zap, Palette, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/3d/ThreeScene'), { ssr: false });

const features = [
  { icon: Rocket, title: 'Quick Setup', description: 'Sign up and build your portfolio in minutes with our intuitive dashboard.', color: '#7c3aed' },
  { icon: Palette, title: 'Premium Design', description: 'Beautiful, animated portfolio with 3D elements, glassmorphism, and dark mode.', color: '#2563eb' },
  { icon: FileText, title: 'Resume Upload', description: 'Upload your resume PDF and let visitors download it directly from your portfolio.', color: '#06b6d4' },
  { icon: Shield, title: 'Secure & Personal', description: 'Your data is yours. Each portfolio is isolated with JWT authentication.', color: '#f59e0b' },
  { icon: Globe, title: 'Shareable Link', description: 'Get a unique URL like /portfolio/yourname to share with anyone.', color: '#ec4899' },
  { icon: Zap, title: 'Dynamic Content', description: 'Add projects, blog posts, skills, experience — all from your dashboard.', color: '#22c55e' },
];

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up with your name, email, and username.' },
  { step: '02', title: 'Fill Your Profile', desc: 'Add your bio, skills, experience, social links, and upload your resume.' },
  { step: '03', title: 'Add Content', desc: 'Add projects, blog posts, and customize your portfolio sections.' },
  { step: '04', title: 'Share Your Link', desc: 'Share your unique portfolio URL with recruiters and the world.' },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 py-4"
        style={{ background: 'rgba(2, 8, 18, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Code2 size={18} color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              Portfoli<span className="gradient-text">axe</span>
            </span>
          </motion.div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/admin">
                  <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                    Dashboard
                  </motion.button>
                </Link>
                {user?.username && (
                  <Link href={`/portfolio/${user.username}`}>
                    <motion.button className="btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                      My Portfolio
                    </motion.button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/admin/login">
                  <motion.button className="btn-outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                    Login
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ padding: 0 }}>
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>
        <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 80%)' }} />
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
              <Sparkles size={14} style={{ color: '#a78bfa' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Free Portfolio Generator</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              Build Your<br />
              <span className="gradient-text">Portfolio</span> in Minutes
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
              style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Create a stunning, professional developer portfolio with 3D animations, dark mode, project showcases, blog, resume upload, and more — all from a simple dashboard.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <motion.button className="btn-primary flex items-center gap-2 text-base px-8 py-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Sparkles size={18} /> Create Your Portfolio <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="tag-chip mb-4 inline-block">Why Portfoliaxe?</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              Everything You <span className="gradient-text">Need</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} className="glass-card p-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -6 }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '6rem 0' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="tag-chip mb-4 inline-block">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} className="glass-card p-8 relative overflow-hidden" initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <span className="absolute top-4 right-4 text-6xl font-black gradient-text" style={{ opacity: 0.15 }}>{s.step}</span>
                <span className="text-xs font-bold gradient-text uppercase tracking-widest">{s.step}</span>
                <h3 className="text-xl font-bold mt-2 mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-secondary)', padding: '5rem 0' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
              Ready to Build Your <span className="gradient-text">Portfolio?</span>
            </h2>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Join and create a portfolio that stands out. It's free and takes just minutes.</p>
            <Link href="/register">
              <motion.button className="btn-primary flex items-center gap-2 mx-auto text-base px-8 py-3" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started Now <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-card)', padding: '2rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Portfoliaxe. Build with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
