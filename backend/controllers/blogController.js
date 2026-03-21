const BlogPost = require('../models/BlogPost');

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// GET /api/blog?userId=xxx
const getPosts = async (req, res) => {
  try {
    const { tag, category, search, userId } = req.query;
    let filter = { published: true };
    if (userId) filter.userId = userId;
    if (tag) filter.tags = tag;
    if (category) filter.category = category;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
    const posts = await BlogPost.find(filter).sort({ createdAt: -1 }).select('-content');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/blog/all (authenticated — user's own posts)
const getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ userId: req.user.id }).sort({ createdAt: -1 }).select('-content');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/blog/:slug?userId=xxx
const getPost = async (req, res) => {
  try {
    const filter = { slug: req.params.slug, published: true };
    if (req.query.userId) filter.userId = req.query.userId;
    const post = await BlogPost.findOne(filter);
    if (!post) return res.status(404).json({ message: 'Blog post not found.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// POST /api/blog (authenticated)
const createPost = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id };
    if (!data.slug) data.slug = slugify(data.title) + '-' + Date.now();
    const post = new BlogPost(data);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: 'Validation error.', error: err.message });
  }
};

// PUT /api/blog/:id (authenticated, owner only)
const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ _id: req.params.id, userId: req.user.id });
    if (!post) return res.status(404).json({ message: 'Blog post not found or not authorized.' });
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: 'Validation error.', error: err.message });
  }
};

// DELETE /api/blog/:id (authenticated, owner only)
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!post) return res.status(404).json({ message: 'Blog post not found or not authorized.' });
    res.json({ message: 'Blog post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getPosts, getAllPosts, getPost, createPost, updatePost, deletePost };
