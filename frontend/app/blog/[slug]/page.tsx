'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPost } from '@/lib/api';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      getBlogPost(params.slug as string)
        .then((res) => setPost(res.data))
        .catch(() => setPost(null))
        .finally(() => setLoading(false));
    }
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Post not found</h1>
        <Link href="/#blog"><button className="btn-primary">Back to Blog</button></Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-6 pt-32 pb-24"
    >
      <Link href="/#blog">
        <button className="flex items-center gap-2 mb-8 text-sm hover:text-purple-400 transition-colors" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} /> Back to Blog
        </button>
      </Link>
      {post.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-8 h-72">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.map((tag: string) => (
          <span key={tag} className="tag-chip"><Tag size={10} className="inline mr-1" />{tag}</span>
        ))}
      </div>
      <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
        {post.title}
      </h1>
      <div className="flex items-center gap-4 mb-10 text-sm" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1"><Calendar size={14} />{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="flex items-center gap-1"><Clock size={14} />{post.readTime} min read</span>
      </div>
      <div className="prose prose-invert max-w-none" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </motion.div>
  );
}
