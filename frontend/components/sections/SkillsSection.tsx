'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SkillGroup {
  category: string;
  color: string;
  icon: string;
  skills: string[];
}

interface SkillsProps {
  skillGroups?: SkillGroup[];
}

function SkillCard({ skill, color, delay }: { skill: string; color: string; delay: number }) {
  return (
    <motion.div
      className="glass-card px-4 py-3 rounded-xl text-sm font-medium cursor-default select-none"
      style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-card)' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{
        scale: 1.08, backgroundColor: `${color}18`, borderColor: `${color}55`,
        color: color, y: -4, boxShadow: `0 8px 30px ${color}30`,
      }}>
      {skill}
    </motion.div>
  );
}

export default function SkillsSection({ skillGroups = [] }: SkillsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (skillGroups.length === 0) return null;

  return (
    <section id="skills" ref={ref} style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="tag-chip mb-4 inline-block">My Toolkit</span>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Skills &amp; <span className="gradient-text">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillGroups.map((group, gi) => (
            <motion.div key={group.category} className="glass-card p-8" initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: gi * 0.15 }} whileHover={{ y: -4 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${group.color}20`, border: `1px solid ${group.color}40` }}>
                  {group.icon}
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{group.category}</h3>
                <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(90deg, ${group.color}60, transparent)` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, si) => (
                  <SkillCard key={skill} skill={skill} color={group.color} delay={gi * 0.1 + si * 0.05} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
