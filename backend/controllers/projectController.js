const Project = require('../models/Project');

// GET /api/projects?userId=xxx
const getProjects = async (req, res) => {
  try {
    const { category, userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (category && category !== 'all') filter.category = category;
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// POST /api/projects (authenticated)
const createProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Validation error.', error: err.message });
  }
};

// PUT /api/projects/:id (authenticated, owner only)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found or not authorized.' });
    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: 'Validation error.', error: err.message });
  }
};

// DELETE /api/projects/:id (authenticated, owner only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found or not authorized.' });
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
