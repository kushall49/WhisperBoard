/**
 * Doubts Routes
 * Handles all doubt-related operations (CRUD)
 */

const express = require('express');
const router = express.Router();
const { db, FieldValue, Timestamp } = require('../config/firestore');

// Collection name
const DOUBTS_COLLECTION = 'doubts';

// ===== Validation Middleware =====

const validateDoubtSubmission = (req, res, next) => {
  const { subject, courseCode, teacher, question } = req.body;

  const errors = [];

  if (!subject || subject.trim() === '') {
    errors.push('Subject is required');
  }

  if (!courseCode || courseCode.trim() === '') {
    errors.push('Course code is required');
  }

  if (!teacher || teacher.trim() === '') {
    errors.push('Teacher name is required');
  }

  if (!question || question.trim() === '') {
    errors.push('Question is required');
  }

  if (question && question.length < 10) {
    errors.push('Question must be at least 10 characters long');
  }

  if (question && question.length > 5000) {
    errors.push('Question must not exceed 5000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateAnswerSubmission = (req, res, next) => {
  const { answer } = req.body;

  const errors = [];

  if (!answer || answer.trim() === '') {
    errors.push('Answer is required');
  }

  if (answer && answer.length < 10) {
    errors.push('Answer must be at least 10 characters long');
  }

  if (answer && answer.length > 10000) {
    errors.push('Answer must not exceed 10000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// ===== Routes =====

/**
 * POST /api/doubts
 * Submit a new doubt (Anonymous student submission)
 */
router.post('/', validateDoubtSubmission, async (req, res) => {
  try {
    const { subject, courseCode, teacher, question } = req.body;

    // Create doubt document
    const doubtData = {
      subject: subject.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      teacher: teacher.trim(),
      question: question.trim(),
      answer: null,
      status: 'Pending',
      createdAt: FieldValue.serverTimestamp(),
      answeredAt: null
    };

    // Add document to Firestore
    const docRef = await db.collection(DOUBTS_COLLECTION).add(doubtData);

    // Get the created document
    const doc = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Doubt submitted successfully',
      data: {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString()
      }
    });

  } catch (error) {
    console.error('Error submitting doubt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit doubt',
      details: error.message
    });
  }
});

/**
 * GET /api/doubts
 * Get all doubts OR filter by teacher
 * Query params: ?teacher=NAME (optional)
 */
router.get('/', async (req, res) => {
  try {
    const { teacher } = req.query;

    let query = db.collection(DOUBTS_COLLECTION);

    // Filter by teacher if provided
    if (teacher) {
      query = query.where('teacher', '==', teacher.trim());
    }

    // Sort by createdAt descending (most recent first)
    query = query.orderBy('createdAt', 'desc');

    // Execute query
    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        message: teacher 
          ? `No doubts found for teacher: ${teacher}` 
          : 'No doubts found',
        data: [],
        count: 0
      });
    }

    // Map documents to array
    const doubts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      answeredAt: doc.data().answeredAt?.toDate().toISOString() || null
    }));

    res.json({
      success: true,
      message: teacher 
        ? `Retrieved doubts for teacher: ${teacher}` 
        : 'Retrieved all doubts',
      data: doubts,
      count: doubts.length
    });

  } catch (error) {
    console.error('Error fetching doubts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doubts',
      details: error.message
    });
  }
});

/**
 * GET /api/doubts/:id
 * Get a specific doubt by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection(DOUBTS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Doubt not found',
        id: id
      });
    }

    res.json({
      success: true,
      message: 'Doubt retrieved successfully',
      data: {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        answeredAt: doc.data().answeredAt?.toDate().toISOString() || null
      }
    });

  } catch (error) {
    console.error('Error fetching doubt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch doubt',
      details: error.message
    });
  }
});

/**
 * POST /api/doubts/:id/answer
 * Submit an answer to a doubt (Teacher functionality)
 */
router.post('/:id/answer', validateAnswerSubmission, async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    const docRef = db.collection(DOUBTS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Doubt not found',
        id: id
      });
    }

    // Check if already answered
    if (doc.data().status === 'Answered') {
      return res.status(400).json({
        success: false,
        error: 'This doubt has already been answered',
        data: {
          id: doc.id,
          ...doc.data()
        }
      });
    }

    // Update document with answer
    await docRef.update({
      answer: answer.trim(),
      status: 'Answered',
      answeredAt: FieldValue.serverTimestamp()
    });

    // Get updated document
    const updatedDoc = await docRef.get();

    res.json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate().toISOString(),
        answeredAt: updatedDoc.data().answeredAt?.toDate().toISOString()
      }
    });

  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit answer',
      details: error.message
    });
  }
});

/**
 * GET /api/doubts/stats/summary
 * Get statistics summary (total, pending, answered)
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const snapshot = await db.collection(DOUBTS_COLLECTION).get();

    const stats = {
      total: snapshot.size,
      pending: 0,
      answered: 0
    };

    snapshot.forEach(doc => {
      if (doc.data().status === 'Pending') {
        stats.pending++;
      } else if (doc.data().status === 'Answered') {
        stats.answered++;
      }
    });

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      details: error.message
    });
  }
});

module.exports = router;
