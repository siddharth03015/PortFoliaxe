'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Github, Linkedin, Mail, CheckCircle2 } from 'lucide-react';
import { sendContact } from '@/lib/api';
import toast from 'react-hot-toast';

interface ContactProps {
  portfolioUserId?: string;
  socialLinks?: { github?: string; linkedin?: string; email?: string };
}

export default function ContactSection({ portfolioUserId, socialLinks }: ContactProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await sendContact({ ...form, portfolioUserId });
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
      toast.success('Message sent! 🚀');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const social = [
    ...(socialLinks?.github ? [{ icon: Github, label: 'GitHub', href: socialLinks.github, color: '#7c3aed' }] : []),
    ...(socialLinks?.linkedin ? [{ icon: Linkedin, label: 'LinkedIn', href: socialLinks.linkedin, color: '#2563eb' }] : []),
    ...(socialLinks?.email ? [{ icon: Mail, label: 'Email', href: `mailto:${socialLinks.email}`, color: '#06b6d4' }] : []),
  ];

  return (
    <section id="contact" ref={ref} style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="tag-chip mb-4 inline-block">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>Have a project in mind or just want to say hi? My inbox is always open!</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="glass-card p-8">
            {success ? (
              <div className="text-center py-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle2 size={64} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
                </motion.div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>They'll get back to you as soon as possible.</p>
                <button className="btn-primary mt-6" onClick={() => setSuccess(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                    onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                    onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                  <textarea rows={5} placeholder="Tell me about your project..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
                    onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; }} />
                </div>
                <motion.button type="submit" className="btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...
                    </span>
                  ) : (<><Send size={16} /> Send Message</>)}
                </motion.button>
              </form>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.4 }} className="flex flex-col gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>
                Ready to build something <span className="gradient-text">amazing?</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Whether you have a project idea, a job opportunity, or just want to chat about tech — I'm always excited to connect.
              </p>
            </div>
            {social.length > 0 && (
              <div className="glass-card p-6">
                <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Find me on</h4>
                <div className="flex flex-col gap-3">
                  {social.map(({ icon: Icon, label, href, color }) => (
                    <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-xl transition-all"
                      style={{ border: '1px solid var(--border-card)' }}
                      whileHover={{ x: 8, borderColor: color, backgroundColor: `${color}10` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Connect & follow</div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
