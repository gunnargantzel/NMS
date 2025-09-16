const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get timelog activities
router.get('/activities', authenticateToken, (req, res) => {
  db.all('SELECT * FROM timelog_activities ORDER BY activity', (err, activities) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(activities);
  });
});

// Get timelog entries for an order
router.get('/order/:orderId', authenticateToken, (req, res) => {
  const { orderId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  db.all(`
    SELECT t.*, u.username as created_by_name 
    FROM timelog_entries t 
    LEFT JOIN users u ON t.created_by = u.id 
    WHERE t.order_id = ? 
    ORDER BY t.timestamp DESC 
    LIMIT ? OFFSET ?
  `, [orderId, parseInt(limit), parseInt(offset)], (err, entries) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM timelog_entries WHERE order_id = ?', [orderId], (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Add timelog entry
router.post('/', authenticateToken, (req, res) => {
  const { order_id, timestamp, activity, remarks } = req.body;

  if (!order_id || !timestamp || !activity) {
    return res.status(400).json({ message: 'Order ID, timestamp, and activity are required' });
  }

  db.run(`
    INSERT INTO timelog_entries (order_id, timestamp, activity, remarks, created_by)
    VALUES (?, ?, ?, ?, ?)
  `, [order_id, timestamp, activity, remarks, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating timelog entry' });
    }

    res.status(201).json({
      message: 'Timelog entry created successfully',
      entryId: this.lastID
    });
  });
});

// Update timelog entry
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { timestamp, activity, remarks } = req.body;

  const updates = [];
  const params = [];

  if (timestamp !== undefined) {
    updates.push('timestamp = ?');
    params.push(timestamp);
  }
  if (activity !== undefined) {
    updates.push('activity = ?');
    params.push(activity);
  }
  if (remarks !== undefined) {
    updates.push('remarks = ?');
    params.push(remarks);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  db.run(`
    UPDATE timelog_entries 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `, params, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating timelog entry' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Timelog entry not found' });
    }

    res.json({ message: 'Timelog entry updated successfully' });
  });
});

// Delete timelog entry
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM timelog_entries WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting timelog entry' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Timelog entry not found' });
    }

    res.json({ message: 'Timelog entry deleted successfully' });
  });
});

// Add new activity
router.post('/activities', authenticateToken, (req, res) => {
  const { activity } = req.body;

  if (!activity) {
    return res.status(400).json({ message: 'Activity is required' });
  }

  db.run('INSERT INTO timelog_activities (activity) VALUES (?)', [activity], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ message: 'Activity already exists' });
      }
      return res.status(500).json({ message: 'Error creating activity' });
    }

    res.status(201).json({
      message: 'Activity created successfully',
      id: this.lastID
    });
  });
});

module.exports = router;
