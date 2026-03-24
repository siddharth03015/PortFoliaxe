'use client';
import { Github, Linkedin, Mail, Code2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  portfolioUser?: { name?: string; username?: string; socialLinks?: { github?: string; linkedin?: string; email?: string } };
}

export default function Footer({ portfolioUser }: FooterProps) {
  const displayName = portfolioUser?.name || 'Portfoliaxe';
  const social = [
    ...(portfolioUser?.socialLinks?.github ? [{ icon: Github, href: portfolioUser.socialLinks.github, label: 'GitHub' }] : []),
    ...(portfolioUser?.socialLinks?.linkedin ? [{ icon: Linkedin, href: portfolioUser.socialLinks.linkedin, label: 'LinkedIn' }] : []),
    ...(portfolioUser?.socialLinks?.email ? [{ icon: Mail, href: `mailto:${portfolioUser.socialLinks.email}`, label: 'Email' }] : []),
  ];

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-card)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Code2 size={18} color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              {displayName.split(' ')[0]}<span className="gradient-text">.</span>
            </span>
          </motion.div>
          {social.length > 0 && (
            <div className="flex items-center gap-4">
              {social.map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="glass-card p-3 rounded-xl cursor-pointer" whileHover={{ scale: 1.1, y: -3 }} whileTap={{ scale: 0.9 }}>
                  <Icon size={18} style={{ color: 'var(--text-secondary)' }} />
                </motion.a>
              ))}
            </div>
          )}
          <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            Made with <Heart size={14} fill="#ef4444" stroke="none" /> by {displayName} © {new Date().getFullYear()}
          </p>
          {portfolioUser && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Built with <a href="/" className="underline" style={{ color: '#a78bfa' }}>Portfoliaxe</a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
