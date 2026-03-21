const express = require('express');
const router = express.Router();
const { getPosts, getAllPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/blogController');
const authMiddleware = require('../middleware/auth');

router.get('/', getPosts);
router.get('/all', authMiddleware, getAllPosts);
router.get('/:slug', getPost);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
