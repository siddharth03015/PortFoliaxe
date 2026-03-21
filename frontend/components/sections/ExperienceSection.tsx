'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Briefcase, Trophy } from 'lucide-react';

interface ExperienceItem {
  expType: string;
  icon: string;
  color: string;
  year: string;
  title: string;
  organization: string;
  description: string;
}

interface ExperienceProps {
  experiences?: ExperienceItem[];
}

const iconMap: Record<string, any> = {
  GraduationCap, Briefcase, Trophy,
};

export default function ExperienceSection({ experiences = [] }: ExperienceProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (experiences.length === 0) return null;

  return (
    <section id="experience" ref={ref} style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="tag-chip mb-4 inline-block">My Journey</span>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 hidden md:block"
            style={{ background: 'linear-gradient(180deg, #7c3aed, #2563eb, #06b6d4, transparent)' }} />

          {experiences.map((exp, i) => {
            const Icon = iconMap[exp.icon] || Briefcase;
            const isLeft = i % 2 === 0;
            return (
              <motion.div key={i}
                className={`relative flex gap-8 mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}>
                <div className="md:w-5/12 glass-card p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${exp.color}20`, border: `1px solid ${exp.color}40` }}>
                      <Icon size={16} style={{ color: exp.color }} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${exp.color}18`, color: exp.color }}>{exp.year}</span>
                  </div>
                  <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{exp.title}</h3>
                  <p className="text-xs font-medium mb-3" style={{ color: exp.color }}>{exp.organization}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{exp.description}</p>
                </div>
                <div className="hidden md:flex items-center justify-center md:w-2/12">
                  <div className="w-5 h-5 rounded-full z-10 flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${exp.color}, #7c3aed)`, boxShadow: `0 0 20px ${exp.color}60` }} />
                </div>
                <div className="md:w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
