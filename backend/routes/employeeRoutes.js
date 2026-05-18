const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeRankings,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const employeeValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['Development', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Design', 'QA', 'DevOps'])
    .withMessage('Invalid department'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('performanceScore')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Performance score must be between 0 and 100'),
  body('experience').isFloat({ min: 0 }).withMessage('Experience must be a positive number'),
];

// Routes
router.get('/search', protect, searchEmployees);         // GET /api/employees/search
router.get('/rankings', protect, getEmployeeRankings);   // GET /api/employees/rankings
router.get('/', protect, getAllEmployees);                // GET /api/employees
router.post('/', protect, employeeValidation, addEmployee); // POST /api/employees
router.get('/:id', protect, getEmployeeById);            // GET /api/employees/:id
router.put('/:id', protect, updateEmployee);             // PUT /api/employees/:id
router.delete('/:id', protect, deleteEmployee);          // DELETE /api/employees/:id

module.exports = router;
