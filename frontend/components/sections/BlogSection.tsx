'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Calendar, Clock, Tag } from 'lucide-react';
import { getBlogPosts } from '@/lib/api';
import Link from 'next/link';

interface BlogProps {
  userId?: string;
}

export default function BlogSection({ userId }: BlogProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    getBlogPosts(userId ? { userId } : undefined)
      .then((res) => {
        setPosts(res.data);
        const tags = Array.from(new Set(res.data.flatMap((p: any) => p.tags || [])));
        setAllTags(tags as string[]);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = posts.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || p.tags?.includes(activeTag);
    return matchSearch && matchTag;
  });

  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
          <span className="tag-chip mb-4 inline-block">Writing</span>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
            Latest <span className="gradient-text">Blog Posts</span>
          </h2>
        </motion.div>

        <motion.div className="mb-8 flex flex-col sm:flex-row gap-4" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveTag('')} className="tag-chip cursor-pointer"
              style={{ background: !activeTag ? 'rgba(124,58,237,0.25)' : undefined }}>All</button>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                className="tag-chip cursor-pointer" style={{ background: activeTag === tag ? 'rgba(124,58,237,0.25)' : undefined }}>{tag}</button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1,2].map((i) => <div key={i} className="glass-card h-48 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((post, i) => (
              <Link key={post._id} href={`/blog/${post.slug || post._id}`}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }} whileHover={{ y: -6 }} className="glass-card overflow-hidden group cursor-pointer h-full">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="tag-chip text-xs"><Tag size={10} className="inline mr-1" />{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold mb-2 hover:text-purple-400 transition-colors"
                      style={{ color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{post.title}</h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime} min read</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
