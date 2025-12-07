import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import AIService from '../services/aiService.js';

const router = express.Router();

/**
 * @route POST /api/assignments/generate
 * @desc Generate a new AI assignment
 */
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { type, topic, difficulty } = req.body;

    if (!type || !topic) {
      return res.status(400).json({ error: 'Type and topic are required' });
    }

    console.log(`🎓 Generating ${difficulty} ${type} assignment on ${topic}...`);
    const assignment = await AIService.generateAssignment(type, topic, difficulty || 'Intermediate');

    res.json({
      success: true,
      data: assignment
    });

  } catch (error) {
    console.error('❌ Assignment generation error:', error);
    res.status(500).json({ error: 'Failed to generate assignment' });
  }
});

export default router;
