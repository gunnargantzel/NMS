const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all survey types
router.get('/types', authenticateToken, (req, res) => {
  db.all('SELECT * FROM survey_types ORDER BY name', (err, surveyTypes) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(surveyTypes);
  });
});

// Add new survey type
router.post('/types', authenticateToken, (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Survey type name is required' });
  }

  db.run(
    'INSERT INTO survey_types (name, description) VALUES (?, ?)',
    [name, description],
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ message: 'Survey type already exists' });
        }
        return res.status(500).json({ message: 'Error creating survey type' });
      }

      res.status(201).json({
        message: 'Survey type created successfully',
        id: this.lastID
      });
    }
  );
});

// Update survey type
router.put('/types/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updates = [];
  const params = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  params.push(id);

  db.run(`
    UPDATE survey_types 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `, params, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ message: 'Survey type name already exists' });
      }
      return res.status(500).json({ message: 'Error updating survey type' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Survey type not found' });
    }

    res.json({ message: 'Survey type updated successfully' });
  });
});

// Delete survey type
router.delete('/types/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Check if survey type is being used in orders
  db.get('SELECT COUNT(*) as count FROM orders WHERE survey_type = (SELECT name FROM survey_types WHERE id = ?)', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.count > 0) {
      return res.status(400).json({ message: 'Cannot delete survey type that is being used in orders' });
    }

    db.run('DELETE FROM survey_types WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting survey type' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Survey type not found' });
      }

      res.json({ message: 'Survey type deleted successfully' });
    });
  });
});

module.exports = router;
