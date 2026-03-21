'use client';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowDown, Download, Github, Mail } from 'lucide-react';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/3d/ThreeScene'), { ssr: false });

interface HeroProps {
  name?: string;
  title?: string;
  tagline?: string;
  socialLinks?: { github?: string; linkedin?: string; email?: string };
  avatarUrl?: string;
  resumeUrl?: string;
  typingRoles?: string[];
}

export default function HeroSection({ name, title, tagline, socialLinks, resumeUrl, typingRoles }: HeroProps) {
  const displayName = name || 'Developer';
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const roles = typingRoles && typingRoles.length > 0
    ? typingRoles.flatMap(r => [r, 2000])
    : [title || 'Developer', 2000, 'Problem Solver', 2000];

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ padding: 0 }}>
      <div className="absolute inset-0 z-0"><ThreeScene /></div>
      <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg-primary) 80%)' }} />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Available for work</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black mb-4 leading-none tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
            {firstName}
            {lastName && <> <span className="gradient-text">{lastName}</span></>}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
            <TypeAnimation sequence={roles} wrapper="span" speed={50} repeat={Infinity} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
            style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {tagline || 'Building scalable digital experiences and modern web applications.'}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <motion.a href="#projects" className="btn-primary flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              View Projects
            </motion.a>
            {resumeUrl && (
              <motion.a href={`${API_BASE}${resumeUrl}`} target="_blank" download
                className="btn-outline flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Download size={16} /> Download Resume
              </motion.a>
            )}
            <motion.a href="#contact" className="btn-outline flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Mail size={16} /> Contact Me
            </motion.a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-4 mt-10">
            {socialLinks?.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="glass-card p-3 rounded-xl" style={{ color: 'var(--text-secondary)' }}>
                <Github size={20} />
              </a>
            )}
            <div className="h-px w-32" style={{ background: 'var(--border-card)' }} />
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>scroll down</span>
            <div className="h-px w-32" style={{ background: 'var(--border-card)' }} />
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ArrowDown size={20} style={{ color: 'var(--text-muted)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
