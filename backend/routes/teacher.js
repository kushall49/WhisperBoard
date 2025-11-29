/**
 * Teacher Routes
 * Handles teacher authentication and related operations
 */

const express = require('express');
const router = express.Router();

// Demo teacher credentials (in production, use proper authentication)
const DEMO_CREDENTIALS = {
  username: 'teacher',
  password: process.env.DEMO_TEACHER_PASSWORD || 'teacher123'
};

/**
 * POST /api/teacher/login
 * Demo teacher login endpoint
 * In production, implement proper JWT-based authentication
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Check credentials
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          username: username,
          role: 'teacher',
          // In production, return a JWT token here
          token: 'demo-token-' + Date.now()
        }
      });
    }

    // Invalid credentials
    res.status(401).json({
      success: false,
      error: 'Invalid username or password'
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message
    });
  }
});

/**
 * GET /api/teacher/profile
 * Get teacher profile (demo endpoint)
 */
router.get('/profile', async (req, res) => {
  try {
    // In production, verify JWT token here
    res.json({
      success: true,
      data: {
        username: 'teacher',
        role: 'teacher',
        email: 'teacher@whisperboard.com'
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      details: error.message
    });
  }
});

module.exports = router;
