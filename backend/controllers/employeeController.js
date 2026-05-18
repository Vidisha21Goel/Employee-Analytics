const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({ name, email, department, skills, performanceScore, experience });
    res.status(201).json({ success: true, message: 'Employee added successfully', data: employee });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Duplicate email: Employee already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search employees by department or name
// @route   GET /api/employees/search?department=Development&name=Aman
// @access  Private
const searchEmployees = async (req, res) => {
  try {
    const { department, name, minScore, maxScore } = req.query;
    const query = {};

    if (department) query.department = { $regex: department, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee rankings
// @route   GET /api/employees/rankings
// @access  Private
const getEmployeeRankings = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    const ranked = employees.map((emp, index) => ({
      rank: index + 1,
      ...emp._doc,
    }));
    res.status(200).json({ success: true, data: ranked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeRankings,
};
