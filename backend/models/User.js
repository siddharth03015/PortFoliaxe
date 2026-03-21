const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  title: { type: String, default: 'Developer' },
  bio: { type: String, default: '' },
  aboutText: { type: String, default: '' },
  tagline: { type: String, default: '' },
  location: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  skills: [{
    name: { type: String },
    level: { type: Number, default: 50 },
    color: { type: String, default: '#7c3aed' },
  }],
  skillGroups: [{
    category: { type: String },
    color: { type: String, default: '#7c3aed' },
    icon: { type: String, default: '⚙️' },
    skills: [{ type: String }],
  }],
  experience: [{
    expType: { type: String, enum: ['education', 'work', 'achievement'], default: 'work' },
    icon: { type: String, default: 'Briefcase' },
    color: { type: String, default: '#7c3aed' },
    year: { type: String },
    title: { type: String },
    organization: { type: String },
    description: { type: String },
  }],
  timeline: [{
    year: { type: String },
    title: { type: String },
    desc: { type: String },
  }],
  typingRoles: [{ type: String }],
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
