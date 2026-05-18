import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addEmployee } from '../utils/api';

const DEPARTMENTS = ['Development', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Design', 'QA', 'DevOps'];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Development',
    skills: [],
    performanceScore: '',
    experience: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (formData.skills.includes(skill)) {
      toast.warning('Skill already added');
      return;
    }
    setFormData({ ...formData, skills: [...formData.skills, skill] });
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';
    if (formData.performanceScore === '' || formData.performanceScore < 0 || formData.performanceScore > 100)
      newErrors.performanceScore = 'Score must be 0-100';
    if (formData.experience === '' || formData.experience < 0)
      newErrors.experience = 'Experience must be a positive number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await addEmployee({
        ...formData,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      });
      toast.success(`${formData.name} added successfully!`);
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add employee';
      toast.error(msg);
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach((e) => {
          apiErrors[e.path] = e.msg;
        });
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">➕ Add Employee</h1>
        <Link to="/employees" className="btn btn-outline">← Back</Link>
      </div>

      <div className="card form-container" style={{ maxWidth: '750px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. Aman Verma"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="aman@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              {errors.department && <span className="form-error">{errors.department}</span>}
            </div>

            {/* Performance Score */}
            <div className="form-group">
              <label className="form-label">Performance Score (0-100) *</label>
              <input
                type="number"
                name="performanceScore"
                className="form-input"
                placeholder="e.g. 85"
                min="0"
                max="100"
                value={formData.performanceScore}
                onChange={handleChange}
              />
              {errors.performanceScore && <span className="form-error">{errors.performanceScore}</span>}
            </div>

            {/* Experience */}
            <div className="form-group">
              <label className="form-label">Years of Experience *</label>
              <input
                type="number"
                name="experience"
                className="form-input"
                placeholder="e.g. 3"
                min="0"
                step="0.5"
                value={formData.experience}
                onChange={handleChange}
              />
              {errors.experience && <span className="form-error">{errors.experience}</span>}
            </div>

            {/* Skills */}
            <div className="form-group full-width">
              <label className="form-label">Skills * (Press Enter or comma to add)</label>
              <div className="skills-input-wrapper" onClick={() => document.getElementById('skill-input').focus()}>
                {formData.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
                <input
                  id="skill-input"
                  className="skills-input"
                  placeholder={formData.skills.length === 0 ? 'Type a skill and press Enter...' : ''}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {['React', 'Node.js', 'MongoDB', 'Python', 'Java', 'AWS'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      if (!formData.skills.includes(s)) {
                        setFormData({ ...formData, skills: [...formData.skills, s] });
                      }
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
              {errors.skills && <span className="form-error">{errors.skills}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <Link to="/employees" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : '✅ Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
