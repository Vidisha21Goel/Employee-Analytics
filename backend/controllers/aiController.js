const Employee = require('../models/Employee');

// @desc    Get AI recommendation for an employee
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const prompt = buildPrompt(employee);

    const aiResponse = await callOpenRouter(prompt);

    res.status(200).json({
      success: true,
      data: {
        employee: {
          name: employee.name,
          department: employee.department,
          performanceScore: employee.performanceScore,
          experience: employee.experience,
          skills: employee.skills,
        },
        recommendation: aiResponse,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI ranking for all employees
// @route   POST /api/ai/rank-all
// @access  Private
const rankAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found' });
    }

    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.experience} yrs | Skills: ${e.skills.join(', ')}`
      )
      .join('\n');

    const prompt = `You are an expert HR analytics AI. Analyze the following employee performance data and provide:
1. Overall ranking with brief justification for each employee
2. Top 3 employees recommended for promotion
3. Employees who need immediate training/improvement plan
4. Department-wise performance summary

Employee Data:
${employeeList}

Provide structured, actionable insights.`;

    const aiResponse = await callOpenRouter(prompt);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: {
        employees: employees.map((e, i) => ({ rank: i + 1, ...e.toObject() })),
        aiAnalysis: aiResponse,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Build prompt for single employee
const buildPrompt = (employee) => {
  const scoreLabel =
    employee.performanceScore >= 85
      ? 'High Performer'
      : employee.performanceScore >= 60
      ? 'Average Performer'
      : 'Needs Improvement';

  return `You are an expert HR analyst AI. Analyze the following employee profile and provide comprehensive recommendations:

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Performance Score: ${employee.performanceScore}/100 (${scoreLabel})
- Years of Experience: ${employee.experience}
- Skills: ${employee.skills.join(', ')}

Please provide:
1. **Promotion Recommendation**: Should this employee be promoted? (Yes/No with reasoning)
2. **Training Suggestions**: Specific skills or courses this employee should pursue
3. **Performance Feedback**: Detailed feedback on their current performance
4. **Career Path**: Suggested career growth path for the next 1-3 years
5. **Skill Gaps**: Any missing critical skills for their role in ${employee.department}

Be specific, constructive, and actionable.`;
};

// Helper: Call OpenRouter API
const callOpenRouter = async (prompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    // Return mock response if no API key is set
    return getMockRecommendation(prompt);
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Employee Analytics System',
    },
    body: JSON.stringify({
      model: 'poolside/laguna-xs.2:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'AI API request failed');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No recommendation generated';
};

// Mock response when no API key
const getMockRecommendation = (prompt) => {
  const isHighPerformer = prompt.includes('High Performer');
  const isAverage = prompt.includes('Average Performer');

  if (isHighPerformer) {
    return `**1. Promotion Recommendation:** YES — This employee demonstrates exceptional performance scores and strong skills. They are ready for the next level.

**2. Training Suggestions:** 
- Advanced Leadership & Management Training
- Strategic Decision Making course
- Cross-departmental project leadership

**3. Performance Feedback:** 
Outstanding performance. Consistently meets and exceeds targets. A role model for peers.

**4. Career Path:** 
Year 1: Senior role → Year 2: Team Lead → Year 3: Manager/Head of Department

**5. Skill Gaps:** 
Consider developing: Project Management (PMP), Budget Management, People Management skills.

*Note: This is a demo recommendation. Add your OpenRouter API key in .env for real AI-powered analysis.*`;
  } else if (isAverage) {
    return `**1. Promotion Recommendation:** NOT YET — Performance is satisfactory but more growth needed before promotion consideration.

**2. Training Suggestions:** 
- Advanced technical skills in current domain
- Communication and presentation skills
- Agile/Scrum methodology

**3. Performance Feedback:** 
Solid contributor. Meets expectations consistently. Focus on taking more initiative and ownership.

**4. Career Path:** 
Year 1: Skill enhancement → Year 2: Senior Individual Contributor → Year 3: Lead/Promotion

**5. Skill Gaps:** 
Consider developing: Leadership skills, advanced domain expertise, cross-team collaboration.

*Note: This is a demo recommendation. Add your OpenRouter API key in .env for real AI-powered analysis.*`;
  } else {
    return `**1. Promotion Recommendation:** NO — Significant improvement needed before considering any promotion.

**2. Training Suggestions:** 
- Foundational skills bootcamp
- Mentorship program with senior team member
- Performance improvement plan with weekly goals

**3. Performance Feedback:** 
Below expected performance. Immediate attention and structured support is required. Regular 1-on-1 sessions recommended.

**4. Career Path:** 
Focus on current role excellence first. Re-evaluate in 6 months after completing improvement plan.

**5. Skill Gaps:** 
Critical skills missing. Prioritize: Core technical competencies, time management, quality of output.

*Note: This is a demo recommendation. Add your OpenRouter API key in .env for real AI-powered analysis.*`;
  }
};

module.exports = { getRecommendation, rankAllEmployees };
