import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployeeById, updateEmployee } from '../utils/api';

const DEPARTMENTS = ['Development', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Design', 'QA', 'DevOps'];

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', department: 'Development',
    skills: [], performanceScore: '', experience: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEmployeeById(id);
        const emp = res.data.data;
        setFormData({
          name: emp.name,
          email: emp.email,
          department: emp.department,
          skills: emp.skills,
          performanceScore: emp.performanceScore,
          experience: emp.experience,
        });
      } catch (err) {
        toast.error('Employee not found');
        navigate('/employees');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || formData.skills.includes(skill)) return;
    setFormData({ ...formData, skills: [...formData.skills, skill] });
    setSkillInput('');
  };

  const removeSkill = (skill) => setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.skills.length === 0) { toast.error('Add at least one skill'); return; }
    setLoading(true);
    try {
      await updateEmployee(id, {
        ...formData,
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience),
      });
      toast.success('Employee updated successfully!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading employee data...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">✏️ Edit Employee</h1>
        <Link to="/employees" className="btn btn-outline">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: '750px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Performance Score (0-100) *</label>
              <input type="number" name="performanceScore" className="form-input" min="0" max="100" value={formData.performanceScore} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience *</label>
              <input type="number" name="experience" className="form-input" min="0" step="0.5" value={formData.experience} onChange={handleChange} required />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Skills * (Press Enter to add)</label>
              <div className="skills-input-wrapper" onClick={() => document.getElementById('skill-edit-input').focus()}>
                {formData.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
                <input
                  id="skill-edit-input"
                  className="skills-input"
                  placeholder="Add skill..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); } }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <Link to="/employees" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
