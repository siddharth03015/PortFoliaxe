'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink, Filter } from 'lucide-react';
import { getProjects } from '@/lib/api';

const filters = ['all', 'fullstack', 'frontend', 'backend', 'ai'];

interface ProjectsProps {
  userId?: string;
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 15;
    setTilt({ x, y });
  };

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.15s ease' }}
      className="glass-card overflow-hidden group relative" whileHover={{ y: -8 }}>
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 tag-chip" style={{background:'rgba(124,58,237,0.25)', color:'#a78bfa'}}>⭐ Featured</div>
      )}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img src={project.imageUrl || 'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?w=600&h=400&fit=crop'}
          alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(2,8,18,0.7))' }} />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{project.title}</h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.techStack?.slice(0, 4).map((tech: string) => <span key={tech} className="tag-chip">{tech}</span>)}
          {project.techStack?.length > 4 && <span className="tag-chip">+{project.techStack.length - 4}</span>}
        </div>
        <div className="flex gap-3">
          {project.githubUrl && (
            <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-purple-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }} whileHover={{ scale: 1.05 }}>
              <Github size={15} /> Code
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-cyan-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }} whileHover={{ scale: 1.05 }}>
              <ExternalLink size={15} /> Live Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ userId }: ProjectsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [projects, setProjects] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProjects(activeFilter, userId)
      .then((res) => setProjects(res.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [activeFilter, userId]);

  if (!loading && projects.length === 0) return null;

  return (
    <section id="projects" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="tag-chip mb-4 inline-block">My Work</span>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-3 mb-12" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
          <Filter size={16} style={{ color: 'var(--text-muted)', alignSelf: 'center' }} />
          {filters.map((f) => (
            <motion.button key={f} onClick={() => setActiveFilter(f)}
              className="px-5 py-2 rounded-full text-sm font-medium capitalize transition-all cursor-pointer"
              style={{
                background: activeFilter === f ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'var(--bg-card)',
                color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${activeFilter === f ? 'transparent' : 'var(--border-card)'}`,
              }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{f}</motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map((i) => <div key={i} className="glass-card h-80 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => <ProjectCard key={project._id} project={project} index={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
