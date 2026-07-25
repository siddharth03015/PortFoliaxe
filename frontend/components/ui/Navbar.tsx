'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, Code2, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  portfolioUser?: { name?: string; username?: string };
}

export default function Navbar({ portfolioUser }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const displayName = portfolioUser?.name?.split(' ')[0] || 'Portfolio';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Portfolio link copied to clipboard! 🔗');
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
      style={{
        background: scrolled ? 'rgba(2, 8, 18, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href={portfolioUser ? `/portfolio/${portfolioUser.username}` : '/'}>
          <motion.div className="flex items-center gap-2 cursor-pointer" whileHover={{ scale: 1.05 }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Code2 size={18} color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
              {displayName}<span className="gradient-text">.</span>
            </span>
          </motion.div>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium transition-colors duration-200 hover:text-purple-400"
                style={{ color: 'var(--text-secondary)' }}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <motion.button onClick={handleShare}
            className="glass-card p-2 rounded-lg cursor-pointer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Share2 size={16} style={{ color: 'var(--text-secondary)' }} />
          </motion.button>
          <motion.button className="md:hidden glass-card p-2 rounded-lg cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)} whileTap={{ scale: 0.9 }}>
            {menuOpen ? <X size={18} style={{ color: 'var(--text-primary)' }} /> : <Menu size={18} style={{ color: 'var(--text-primary)' }} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden" style={{ background: 'rgba(2, 8, 18, 0.95)', backdropFilter: 'blur(20px)' }}>
            <ul className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}
                    className="block text-base font-medium hover:text-purple-400 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}>{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
