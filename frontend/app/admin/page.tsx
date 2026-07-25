'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, LogOut, FolderOpen, BookOpen, Mail, X, Save, UserCircle, Upload, ExternalLink, Code2 } from 'lucide-react';
import {
  getProjects, createProject, updateProject, deleteProject,
  getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  getContacts, updateProfile, uploadResume, uploadAvatar
} from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'projects' | 'blog' | 'messages';

const defaultProject = { title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '', category: 'fullstack', featured: false };
const defaultBlog = { title: '', excerpt: '', content: '', tags: '', category: 'General', coverImage: '', published: false, readTime: 5 };

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('profile');
  const [projects, setProjects] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [modal, setModal] = useState<{ type: 'project' | 'blog'; data: any; isEdit: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<any>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/admin/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setProfile({
        name: user.name || '',
        title: user.title || '',
        bio: user.bio || '',
        aboutText: user.aboutText || '',
        tagline: user.tagline || '',
        location: user.location || '',
        avatarUrl: user.avatarUrl || '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || '',
          email: user.socialLinks?.email || '',
          website: user.socialLinks?.website || '',
        },
        skills: user.skills ? JSON.stringify(user.skills) : '[]',
        skillGroups: user.skillGroups ? JSON.stringify(user.skillGroups) : '[]',
        experience: user.experience ? JSON.stringify(user.experience) : '[]',
        timeline: user.timeline ? JSON.stringify(user.timeline) : '[]',
        typingRoles: user.typingRoles ? user.typingRoles.join(', ') : '',
      });
      loadProjects();
      loadPosts();
      loadContacts();
    }
  }, [isAuthenticated, user]);

  const loadProjects = () => getProjects(undefined, user?._id || user?.id).then((r) => setProjects(r.data)).catch(() => {});
  const loadPosts = () => getAllBlogPosts().then((r) => setPosts(r.data)).catch(() => {});
  const loadContacts = () => getContacts().then((r) => setContacts(r.data)).catch(() => {});

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    try {
      let parsedSkills, parsedSkillGroups, parsedExperience, parsedTimeline;
      try { parsedSkills = JSON.parse(profile.skills); } catch { parsedSkills = []; }
      try { parsedSkillGroups = JSON.parse(profile.skillGroups); } catch { parsedSkillGroups = []; }
      try { parsedExperience = JSON.parse(profile.experience); } catch { parsedExperience = []; }
      try { parsedTimeline = JSON.parse(profile.timeline); } catch { parsedTimeline = []; }
      const data = {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        aboutText: profile.aboutText,
        tagline: profile.tagline,
        location: profile.location,
        avatarUrl: profile.avatarUrl,
        socialLinks: profile.socialLinks,
        skills: parsedSkills,
        skillGroups: parsedSkillGroups,
        experience: parsedExperience,
        timeline: parsedTimeline,
        typingRoles: profile.typingRoles.split(',').map((s: string) => s.trim()).filter(Boolean),
      };
      await updateProfile(data);
      await refreshUser();
      toast.success('Profile updated! ✨');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files allowed.');
      return;
    }
    setResumeUploading(true);
    try {
      await uploadResume(file);
      await refreshUser();
      toast.success('Resume uploaded! 📄');
    } catch {
      toast.error('Upload failed.');
    } finally {
      setResumeUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed.');
      return;
    }
    setAvatarUploading(true);
    try {
      const res = await uploadAvatar(file);
      setProfile({ ...profile, avatarUrl: res.data.avatarUrl });
      await refreshUser();
      toast.success('Avatar uploaded! 🖼️');
    } catch {
      toast.error('Upload failed.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      const data = { ...modal.data, techStack: modal.data.techStack?.split(',').map((s: string) => s.trim()).filter(Boolean) };
      if (modal.isEdit) { await updateProject(modal.data._id, data); toast.success('Project updated!'); }
      else { await createProject(data); toast.success('Project created!'); }
      loadProjects(); setModal(null);
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleSaveBlog = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      const data = { ...modal.data, tags: modal.data.tags?.split(',').map((s: string) => s.trim()).filter(Boolean) };
      if (modal.isEdit) { await updateBlogPost(modal.data._id, data); toast.success('Post updated!'); }
      else { await createBlogPost(data); toast.success('Post created!'); }
      loadPosts(); setModal(null);
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id); toast.success('Deleted.'); loadProjects();
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await deleteBlogPost(id); toast.success('Deleted.'); loadPosts();
  };

  if (isLoading || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: UserCircle, count: null },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen, count: projects.length },
    { id: 'blog' as Tab, label: 'Blog Posts', icon: BookOpen, count: posts.length },
    { id: 'messages' as Tab, label: 'Messages', icon: Mail, count: contacts.length },
  ];

  const inputStyle: React.CSSProperties = { background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', color: 'var(--text-primary)', borderRadius: 12, padding: '0.6rem 1rem', width: '100%', fontSize: 14, outline: 'none' };
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

  return (
    <div className="min-h-screen pt-8 px-4 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                <Code2 size={18} color="white" />
              </div>
            </Link>
            <div>
              <h1 className="text-3xl font-black gradient-text" style={{ fontFamily: 'Space Grotesk' }}>Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome, {user?.name || user?.username} 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.username && (
              <Link href={`/portfolio/${user.username}`} target="_blank">
                <motion.button className="btn-outline flex items-center gap-2" whileHover={{ scale: 1.05 }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <ExternalLink size={14} /> View Portfolio
                </motion.button>
              </Link>
            )}
            <motion.button onClick={() => { logout(); router.push('/'); }} className="btn-outline flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <LogOut size={15} /> Logout
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{
                background: tab === id ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'var(--bg-card)',
                color: tab === id ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${tab === id ? 'transparent' : 'var(--border-card)'}`,
              }}>
              <Icon size={15} /> {label}
              {count !== null && (
                <span className="px-1.5 py-0.5 text-xs rounded-full" style={{ background: tab === id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)' }}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Edit Your Profile</h2>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="John Doe" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title / Role</label>
                  <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} placeholder="Full Stack Developer" style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tagline</label>
                <input value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} placeholder="Building scalable digital experiences..." style={inputStyle} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Location</label>
                  <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="India" style={inputStyle} />
                </div>
              </div>

              {/* Avatar Upload Section */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Profile Avatar</h3>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Avatar Preview */}
                  <div className="flex-shrink-0">
                    {(profile.avatarUrl || user?.avatarUrl) ? (
                      <div className="w-32 h-32 rounded-2xl overflow-hidden" style={{ border: '2px solid var(--border-card)' }}>
                        <img
                          src={profile.avatarUrl?.startsWith('http') ? profile.avatarUrl : `${API_BASE}${profile.avatarUrl || user?.avatarUrl}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border-card)' }}>
                        <UserCircle size={48} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                  </div>

                  {/* Upload Area */}
                  <div className="flex-1 w-full">
                    <label className="flex flex-col items-center justify-center w-full py-8 rounded-2xl cursor-pointer transition-all hover:border-purple-500/50"
                      style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border-card)' }}>
                      <Upload size={28} style={{ color: 'var(--text-muted)' }} className={avatarUploading ? 'animate-bounce' : ''} />
                      <span className="text-sm font-medium mt-3" style={{ color: 'var(--text-secondary)' }}>
                        {avatarUploading ? 'Uploading...' : 'Click to upload avatar'}
                      </span>
                      <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        PNG, JPG, GIF up to 5MB
                      </span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={avatarUploading} />
                    </label>

                    <div className="mt-4">
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Or paste an image URL</label>
                      <input value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} placeholder="https://example.com/avatar.jpg" style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Short Bio</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="I'm a passionate developer..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>About Text (extended)</label>
                <textarea rows={4} value={profile.aboutText} onChange={(e) => setProfile({ ...profile, aboutText: e.target.value })}
                  placeholder="When I'm not coding, I'm..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Typing Roles (comma separated, for hero animation)</label>
                <input value={profile.typingRoles} onChange={(e) => setProfile({ ...profile, typingRoles: e.target.value })}
                  placeholder="Full Stack Developer, React Specialist, Node.js Engineer" style={inputStyle} />
              </div>

              {/* Social Links */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['github', 'linkedin', 'twitter', 'email', 'website'].map((key) => (
                    <div key={key}>
                      <label className="block text-xs font-medium mb-1.5 capitalize" style={{ color: 'var(--text-secondary)' }}>{key}</label>
                      <input value={profile.socialLinks?.[key] || ''} onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [key]: e.target.value } })}
                        placeholder={key === 'email' ? 'you@example.com' : `https://${key}.com/...`} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Upload */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Resume PDF</h3>
                {user?.resumeUrl && (
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    Current: <a href={`${API_BASE}${user.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                      className="underline" style={{ color: '#a78bfa' }}>View Resume</a>
                  </p>
                )}
                <label className="btn-outline flex items-center gap-2 cursor-pointer inline-flex" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <Upload size={14} />
                  {resumeUploading ? 'Uploading...' : 'Upload Resume PDF'}
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" disabled={resumeUploading} />
                </label>
              </div>

              {/* Skills JSON */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Skills (JSON array)</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Format: [{"{"}&quot;name&quot;:&quot;React&quot;, &quot;level&quot;:90, &quot;color&quot;:&quot;#7c3aed&quot;{"}"}]</p>
                <textarea rows={4} value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  style={{ ...inputStyle, fontFamily: 'Fira Code, monospace', fontSize: 12, resize: 'vertical' }} />
              </div>

              {/* Skill Groups JSON */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Skill Groups (JSON array)</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Format: [{"{"}&quot;category&quot;:&quot;Frontend&quot;, &quot;color&quot;:&quot;#7c3aed&quot;, &quot;icon&quot;:&quot;⚛️&quot;, &quot;skills&quot;:[&quot;React&quot;,&quot;Next.js&quot;]{"}"}]</p>
                <textarea rows={4} value={profile.skillGroups} onChange={(e) => setProfile({ ...profile, skillGroups: e.target.value })}
                  style={{ ...inputStyle, fontFamily: 'Fira Code, monospace', fontSize: 12, resize: 'vertical' }} />
              </div>

              {/* Experience JSON */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Experience (JSON array)</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Format: [{"{"}&quot;type&quot;:&quot;work&quot;, &quot;icon&quot;:&quot;Briefcase&quot;, &quot;color&quot;:&quot;#2563eb&quot;, &quot;year&quot;:&quot;2023-2024&quot;, &quot;title&quot;:&quot;Dev&quot;, &quot;organization&quot;:&quot;Company&quot;, &quot;description&quot;:&quot;...&quot;{"}"}]</p>
                <textarea rows={4} value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  style={{ ...inputStyle, fontFamily: 'Fira Code, monospace', fontSize: 12, resize: 'vertical' }} />
              </div>

              {/* Timeline JSON */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Timeline (JSON array)</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Format: [{"{"}&quot;year&quot;:&quot;2020&quot;, &quot;title&quot;:&quot;Started Coding&quot;, &quot;desc&quot;:&quot;...&quot;{"}"}]</p>
                <textarea rows={4} value={profile.timeline} onChange={(e) => setProfile({ ...profile, timeline: e.target.value })}
                  style={{ ...inputStyle, fontFamily: 'Fira Code, monospace', fontSize: 12, resize: 'vertical' }} />
              </div>

              <motion.button onClick={handleSaveProfile} className="btn-primary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={profileSaving}>
                {profileSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                {profileSaving ? 'Saving...' : 'Save Profile'}
              </motion.button>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>All Projects</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => setModal({ type: 'project', data: { ...defaultProject }, isEdit: false })}>
                <Plus size={15} /> Add Project
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex gap-4 items-start">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                      <div className="flex gap-2 ml-2 flex-shrink-0">
                        <button onClick={() => setModal({ type: 'project', data: { ...p, techStack: p.techStack?.join(', ') }, isEdit: true })}
                          className="p-1.5 rounded-lg hover:bg-purple-500/20 transition-colors"><Pencil size={13} style={{ color: '#a78bfa' }} /></button>
                        <button onClick={() => handleDeleteProject(p._id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"><Trash2 size={13} style={{ color: '#f87171' }} /></button>
                      </div>
                    </div>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.techStack?.slice(0, 3).map((t: string) => <span key={t} className="tag-chip" style={{ fontSize: 10 }}>{t}</span>)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {tab === 'blog' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Blog Posts</h2>
              <button className="btn-primary flex items-center gap-2" onClick={() => setModal({ type: 'blog', data: { ...defaultBlog }, isEdit: false })}>
                <Plus size={15} /> Add Post
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {posts.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{p.category} · {p.readTime} min read</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setModal({ type: 'blog', data: { ...p, tags: p.tags?.join(', ') }, isEdit: true })}
                      className="p-1.5 rounded-lg hover:bg-purple-500/20 transition-colors"><Pencil size={13} style={{ color: '#a78bfa' }} /></button>
                    <button onClick={() => handleDeletePost(p._id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"><Trash2 size={13} style={{ color: '#f87171' }} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {tab === 'messages' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Contact Messages</h2>
            {contacts.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No messages yet. Share your portfolio to receive messages!</p>
            ) : contacts.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{c.email}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.message}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,8,18,0.8)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>
                  {modal.isEdit ? 'Edit' : 'Add'} {modal.type === 'project' ? 'Project' : 'Blog Post'}
                </h2>
                <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={18} style={{ color: 'var(--text-muted)' }} /></button>
              </div>

              <div className="flex flex-col gap-4">
                {modal.type === 'project' ? (
                  <>
                    {[['title','Title','My Awesome Project'],['description','Description','Short description'],['imageUrl','Image URL','https://...'],['githubUrl','GitHub URL','https://github.com/...'],['liveUrl','Live URL','https://...']].map(([key, label, ph]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                        <input value={modal.data[key] || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, [key]: e.target.value } })}
                          placeholder={ph} style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tech Stack (comma separated)</label>
                      <input value={modal.data.techStack || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, techStack: e.target.value } })}
                        placeholder="React, Node.js, MongoDB" style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                        <select value={modal.data.category} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })} style={inputStyle}>
                          {['fullstack','frontend','backend','ai','other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-5">
                        <input type="checkbox" id="featured" checked={modal.data.featured} onChange={(e) => setModal({ ...modal, data: { ...modal.data, featured: e.target.checked } })} />
                        <label htmlFor="featured" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Featured project</label>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {[['title','Title','Post Title'],['excerpt','Excerpt','Short summary...'],['coverImage','Cover Image URL','https://...']].map(([key, label, ph]) => (
                      <div key={key}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                        <input value={modal.data[key] || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, [key]: e.target.value } })}
                          placeholder={ph} style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content (Markdown)</label>
                      <textarea rows={8} value={modal.data.content || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, content: e.target.value } })}
                        placeholder="# My Blog Post&#10;&#10;Write your content here..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Fira Code, monospace', fontSize: 13 }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
                      <input value={modal.data.tags || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, tags: e.target.value } })}
                        placeholder="React, Node.js, Tutorial" style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                        <input value={modal.data.category || ''} onChange={(e) => setModal({ ...modal, data: { ...modal.data, category: e.target.value } })}
                          placeholder="Frontend" style={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Read Time (mins)</label>
                        <input type="number" value={modal.data.readTime || 5} onChange={(e) => setModal({ ...modal, data: { ...modal.data, readTime: Number(e.target.value) } })}
                          style={inputStyle} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="published" checked={modal.data.published} onChange={(e) => setModal({ ...modal, data: { ...modal.data, published: e.target.checked } })} />
                      <label htmlFor="published" className="text-sm" style={{ color: 'var(--text-secondary)' }}>Publish immediately</label>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button onClick={modal.type === 'project' ? handleSaveProject : handleSaveBlog}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={saving}>
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                  {saving ? 'Saving...' : 'Save'}
                </motion.button>
                <button onClick={() => setModal(null)} className="btn-outline px-6">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
