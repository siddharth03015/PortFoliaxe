const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  content: { type: String, required: true }, // Markdown
  excerpt: { type: String, default: '' },
  tags: [{ type: String }],
  category: { type: String, default: 'General' },
  coverImage: { type: String, default: '' },
  published: { type: Boolean, default: false },
  readTime: { type: Number, default: 5 }, // in minutes
}, { timestamps: true });

// Unique slug per user (not globally)
blogPostSchema.index({ userId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
