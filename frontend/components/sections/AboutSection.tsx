'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AboutProps {
  name?: string;
  bio?: string;
  aboutText?: string;
  location?: string;
  title?: string;
  avatarUrl?: string;
  skills?: { name: string; level: number; color: string }[];
  timeline?: { year: string; title: string; desc: string }[];
}

function SkillBar({ skill, index }: { skill: { name: string; level: number; color: string }; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{skill.name}</span>
        <span className="text-sm font-semibold" style={{ color: skill.color }}>{skill.level}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--border-card)' }}>
        <motion.div className="h-2 rounded-full"
          style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

export default function AboutSection({ name, bio, aboutText, location, title, avatarUrl, skills = [], timeline = [] }: AboutProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const resolvedAvatarUrl = avatarUrl?.startsWith('/') ? `${API_BASE}${avatarUrl}` : avatarUrl;

  if (!name && !bio && skills.length === 0 && timeline.length === 0) return null;

  return (
    <section id="about" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="tag-chip mb-4 inline-block">About Me</span>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>
            My <span className="gradient-text">Story</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.div className="glass-card p-8 mb-8" initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="flex items-center gap-4 mb-6">
                {resolvedAvatarUrl && (
                  <div className="float-animation flex-shrink-0 relative" style={{ width: 80, height: 80 }}>
                    <img src={resolvedAvatarUrl} alt={name} style={{ width: 80, height: 80, borderRadius: '18px', objectFit: 'cover', objectPosition: 'center top',
                      border: '2px solid rgba(124,58,237,0.5)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }} />
                    <span style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: '2px solid var(--bg-card)', display: 'block' }} />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{title || 'Developer'}{location ? ` · ${location}` : ''}</p>
                </div>
              </div>
              {bio && <p className="leading-relaxed text-base" style={{ color: 'var(--text-secondary)' }}>{bio}</p>}
              {aboutText && <p className="leading-relaxed text-base mt-4" style={{ color: 'var(--text-secondary)' }}>{aboutText}</p>}
            </motion.div>

            {skills.length > 0 && (
              <motion.div className="glass-card p-8" initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.4 }}>
                <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Core Proficiency</h3>
                {skills.map((skill, i) => <SkillBar key={skill.name} skill={skill} index={i} />)}
              </motion.div>
            )}
          </div>

          {timeline.length > 0 && (
            <div>
              <motion.h3 className="text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
                Learning <span className="gradient-text">Journey</span>
              </motion.h3>
              <div className="relative pl-8">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, #7c3aed, #2563eb, transparent)' }} />
                {timeline.map((item, i) => (
                  <motion.div key={item.year} className="relative mb-8" initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}>
                    <div className="absolute -left-8 top-1 timeline-dot" />
                    <div className="glass-card p-5">
                      <span className="text-xs font-bold gradient-text uppercase tracking-widest">{item.year}</span>
                      <h4 className="text-base font-bold mt-1 mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
