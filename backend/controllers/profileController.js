const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// GET /api/profile/:username — public
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PUT /api/profile — authenticated
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'title', 'bio', 'aboutText', 'tagline', 'location',
      'avatarUrl', 'socialLinks', 'skills', 'skillGroups',
      'experience', 'timeline', 'typingRoles',
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed.', error: err.message });
  }
};

// POST /api/profile/resume — authenticated, upload resume PDF
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF.' });
    }
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { resumeUrl }, { new: true }).select('-password');
    res.json({ message: 'Resume uploaded successfully.', resumeUrl, user });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed.', error: err.message });
  }
};

// GET /api/profile/:username/resume — public, download resume
const getResume = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('resumeUrl name');
    if (!user || !user.resumeUrl) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    const filePath = path.join(__dirname, '..', user.resumeUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Resume file not found.' });
    }
    const filename = `${user.name || user.username}_resume.pdf`;
    res.download(filePath, filename);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, getResume };
