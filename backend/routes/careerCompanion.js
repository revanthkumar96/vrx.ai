import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import AIService from '../services/aiService.js';

const router = express.Router();

// AI Career Companion Chat - AI-powered career guidance assistant with comprehensive user data access
router.post('/chat', authenticateToken, async (req, res) => {
  let client;
  try {
    const userId = req.user.userId;
    const { message, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    client = await pool.connect();

    // 1. Fetch comprehensive user context
    const userContextQuery = `
      SELECT 
        u.name, u.email, 
        up.linkedin_handle, up.leetcode_handle, up.codechef_handle, up.codeforces_handle, 
        up.skills, up.study_domain, up.study_year,
        cs.leetcode_solved, cs.codechef_solved, cs.codeforces_solved, cs.codeforces_contest_solved, cs.current_streak as coding_current_streak,
        da.activity_date, da.study_minutes -- Get recent activity if available
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN coding_stats cs ON u.id = cs.user_id
      LEFT JOIN daily_activity_tracking da ON u.id = da.user_id AND da.activity_date = CURRENT_DATE
      WHERE u.id = $1
    `;
    
    const userResult = await client.query(userContextQuery, [userId]);
    const userData = userResult.rows[0] || {};

    // 2. Prepare Context for AI
    const careerContext = {
      ...userData,
      history: context?.history || []
    };
    
    console.log('💼 Processing career chat for:', userData.name);

    // 3. Generate Response
    const chatResponse = await AIService.generateCareerCompanionChatResponse(message, careerContext);
    
    res.json({
      success: true,
      response: chatResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Career companion chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process your career query.',
      details: error.message
    });
  } finally {
    if (client) client.release();
  }
});

// Get user's career insights and progress summary
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('📈 Generating career insights for user:', userId);

    // Get career relevant data
    const insightsQuery = `
      WITH recent_activity AS (
        SELECT 
          COUNT(*) as active_days_last_week,
          AVG(problems_solved) as avg_problems_per_day,
          MAX(activity_date) as last_active
        FROM daily_activity 
        WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '7 days'
      ),
      stress_indicators AS (
        SELECT 
          COUNT(CASE WHEN activity_date >= CURRENT_DATE - INTERVAL '3 days' AND problems_solved > 10 THEN 1 END) as high_intensity_days,
          COUNT(CASE WHEN activity_date >= CURRENT_DATE - INTERVAL '7 days' AND problems_solved = 0 THEN 1 END) as zero_progress_days
        FROM daily_activity 
        WHERE user_id = $1
      ),
      achievement_momentum AS (
        SELECT 
          COUNT(CASE WHEN completed_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as recent_completions,
          COUNT(CASE WHEN completed_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as monthly_completions
        FROM user_module_progress 
        WHERE user_id = $1 AND completed = true
      )
      SELECT 
        u.name, u.learning_streak,
        cs.current_streak as coding_streak,
        cs.leetcode_solved, cs.codechef_solved, cs.codeforces_solved,
        ra.active_days_last_week,
        ra.avg_problems_per_day,
        ra.last_active,
        si.high_intensity_days,
        si.zero_progress_days,
        am.recent_completions,
        am.monthly_completions,
        ug.monthly_coding_goal,
        ug.daily_study_goal_minutes
      FROM users u
      LEFT JOIN coding_stats cs ON u.id = cs.user_id
      LEFT JOIN recent_activity ra ON true
      LEFT JOIN stress_indicators si ON true
      LEFT JOIN achievement_momentum am ON true
      LEFT JOIN user_goals ug ON u.id = ug.user_id
      WHERE u.id = $1
    `;
    
    const result = await pool.query(insightsQuery, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const insights = result.rows[0];
    
    // Generate career recommendations
    const recommendations = generateCareerRecommendations(insights);

    res.json({
      success: true,
      data: {
        ...insights,
        career_readiness_score: calculateCareerReadinessScore(insights),
        recommendations,
        engagement_level: assessEngagementLevel(insights)
      }
    });

  } catch (error) {
    console.error('❌ Error generating mental health insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate career insights',
      details: error.message
    });
  }
});

// Helper function to calculate career readiness score
function calculateCareerReadinessScore(insights) {
  let score = 50; // Base score
  
  // Positive factors
  if (insights.coding_streak > 0) score += Math.min(insights.coding_streak * 2, 20);
  if (insights.active_days_last_week >= 5) score += 10;
  if (insights.recent_completions > 0) score += 15;
  if (insights.leetcode_solved > 50) score += 10;
  
  // Negative factors
  if (insights.zero_progress_days > 4) score -= 10;
  if (insights.active_days_last_week === 0) score -= 15;
  
  return Math.max(0, Math.min(100, score));
}

// Helper function to assess engagement level
function assessEngagementLevel(insights) {
  if (insights.high_intensity_days > 3) {
    return 'high';
  } else if (insights.active_days_last_week >= 3) {
    return 'medium';
  } else {
    return 'low';
  }
}

// Helper function to generate career recommendations
function generateCareerRecommendations(insights) {
  const recommendations = [];
  const userName = insights.name || 'friend';

  // Intensity management
  if (insights.high_intensity_days > 2) {
    recommendations.push({
      type: 'intensity',
      title: 'Keep the Momentum',
      description: `${userName}, you've had ${insights.high_intensity_days} high-intensity coding days recently. Great job, but avoid burnout!`,
      priority: 'high'
    });
  }

  // Motivation recommendations
  if (insights.zero_progress_days > 2) {
    recommendations.push({
      type: 'motivation',
      title: 'Consistency is Key',
      description: `Try to solve at least one problem today, ${userName}. Consistency beats intensity.`,
      priority: 'medium'
    });
  }

  // Achievement recognition
  if (insights.recent_completions > 0) {
    recommendations.push({
      type: 'achievement',
      title: 'Milestone Reached',
      description: `Excellent work completing ${insights.recent_completions} modules recently! You are advancing well.`,
      priority: 'low'
    });
  }

  // Streak maintenance
  if (insights.coding_streak > 7) {
    recommendations.push({
      type: 'streak',
      title: 'Impressive Streak',
      description: `Your ${insights.coding_streak}-day streak is solid proof of your dedication!`,
      priority: 'medium'
    });
  }

  // Default recommendations if no specific issues
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'general',
      title: 'Focus on Goals',
      description: `You're doing well, ${userName}. Review your monthly goals to stay on track.`,
      priority: 'low'
    });
  }

  return recommendations;
}

export default router;
