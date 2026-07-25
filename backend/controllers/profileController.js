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

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    user.resumeData = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
    user.resumeUrl = `/api/profile/${user.username}/resume`;
    await user.save();
    
    // We must omit the huge data buffer when sending back the user object
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.resumeData;
    delete userObject.avatarData;
    
    res.json({ message: 'Resume uploaded successfully.', resumeUrl: user.resumeUrl, user: userObject });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed.', error: err.message });
  }
};

// POST /api/profile/avatar — authenticated, upload avatar image
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload an image.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.avatarData = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
    user.avatarUrl = `/api/profile/${user.username}/avatar`;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.resumeData;
    delete userObject.avatarData;

    res.json({ message: 'Avatar uploaded successfully.', avatarUrl: user.avatarUrl, user: userObject });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed.', error: err.message });
  }
};

// GET /api/profile/:username/resume — public, download resume
const getResume = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('resumeData name username');
    if (!user || !user.resumeData || !user.resumeData.data) {
      return res.status(404).json({ message: 'Resume not found.' });
    }
    
    res.set('Content-Type', user.resumeData.contentType);
    res.set('Content-Disposition', `attachment; filename="${user.name || user.username}_resume.pdf"`);
    res.send(user.resumeData.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/profile/:username/avatar — public, view avatar
const getAvatar = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('avatarData');
    if (!user || !user.avatarData || !user.avatarData.data) {
      return res.status(404).json({ message: 'Avatar not found.' });
    }
    
    res.set('Content-Type', user.avatarData.contentType);
    res.send(user.avatarData.data);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, getResume, uploadAvatar, getAvatar };
