'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPublicProfile } from '@/lib/api';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';

export default function PortfolioPage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;
    getPublicProfile(username)
      .then((res) => setProfile(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: 'var(--text-muted)' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center glass-card p-12">
          <h1 className="text-4xl font-black mb-4 gradient-text" style={{ fontFamily: 'Space Grotesk' }}>404</h1>
          <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Portfolio not found</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            The user <strong>@{username}</strong> doesn't exist or hasn't created their portfolio yet.
          </p>
          <a href="/" className="btn-primary inline-block">Go Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <Navbar portfolioUser={profile} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <HeroSection
          name={profile.name}
          title={profile.title}
          tagline={profile.tagline}
          socialLinks={profile.socialLinks}
          avatarUrl={profile.avatarUrl}
          resumeUrl={profile.resumeUrl}
          typingRoles={profile.typingRoles}
        />
        <AboutSection
          name={profile.name}
          bio={profile.bio}
          aboutText={profile.aboutText}
          location={profile.location}
          title={profile.title}
          avatarUrl={profile.avatarUrl}
          skills={profile.skills}
          timeline={profile.timeline}
        />
        <SkillsSection skillGroups={profile.skillGroups} />
        <ProjectsSection userId={profile._id} />
        <ExperienceSection experiences={profile.experience} />
        <BlogSection userId={profile._id} />
        <ContactSection portfolioUserId={profile._id} socialLinks={profile.socialLinks} />
      </motion.div>
      <Footer portfolioUser={profile} />
    </>
  );
}
