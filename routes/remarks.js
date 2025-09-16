const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get remarks templates
router.get('/templates', authenticateToken, (req, res) => {
  const { category } = req.query;

  let query = 'SELECT * FROM remarks_templates';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY category, template';

  db.all(query, params, (err, templates) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(templates);
  });
});

// Get categories
router.get('/categories', authenticateToken, (req, res) => {
  db.all('SELECT DISTINCT category FROM remarks_templates ORDER BY category', (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(categories.map(c => c.category));
  });
});

// Add new remarks template
router.post('/templates', authenticateToken, (req, res) => {
  const { category, template } = req.body;

  if (!category || !template) {
    return res.status(400).json({ message: 'Category and template are required' });
  }

  db.run(
    'INSERT INTO remarks_templates (category, template) VALUES (?, ?)',
    [category, template],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating remarks template' });
      }

      res.status(201).json({
        message: 'Remarks template created successfully',
        id: this.lastID
      });
    }
  );
});

// Update remarks template
router.put('/templates/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { category, template } = req.body;

  const updates = [];
  const params = [];

  if (category !== undefined) {
    updates.push('category = ?');
    params.push(category);
  }
  if (template !== undefined) {
    updates.push('template = ?');
    params.push(template);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  params.push(id);

  db.run(`
    UPDATE remarks_templates 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `, params, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating remarks template' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Remarks template not found' });
    }

    res.json({ message: 'Remarks template updated successfully' });
  });
});

// Delete remarks template
router.delete('/templates/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM remarks_templates WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting remarks template' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Remarks template not found' });
    }

    res.json({ message: 'Remarks template deleted successfully' });
  });
});

module.exports = router;
