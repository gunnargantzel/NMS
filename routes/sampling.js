const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get sampling records for an order
router.get('/order/:orderId', authenticateToken, (req, res) => {
  const { orderId } = req.params;

  db.all(`
    SELECT s.*, u.username as created_by_name 
    FROM sampling_records s 
    LEFT JOIN users u ON s.created_by = u.id 
    WHERE s.order_id = ? 
    ORDER BY s.created_at DESC
  `, [orderId], (err, records) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(records);
  });
});

// Add sampling record
router.post('/', authenticateToken, (req, res) => {
  const { order_id, sample_type, quantity, destination, seal_number, remarks } = req.body;

  if (!order_id || !sample_type) {
    return res.status(400).json({ message: 'Order ID and sample type are required' });
  }

  db.run(`
    INSERT INTO sampling_records (order_id, sample_type, quantity, destination, seal_number, remarks, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [order_id, sample_type, quantity, destination, seal_number, remarks, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating sampling record' });
    }

    res.status(201).json({
      message: 'Sampling record created successfully',
      recordId: this.lastID
    });
  });
});

// Update sampling record
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { sample_type, quantity, destination, seal_number, remarks } = req.body;

  const updates = [];
  const params = [];

  if (sample_type !== undefined) {
    updates.push('sample_type = ?');
    params.push(sample_type);
  }
  if (quantity !== undefined) {
    updates.push('quantity = ?');
    params.push(quantity);
  }
  if (destination !== undefined) {
    updates.push('destination = ?');
    params.push(destination);
  }
  if (seal_number !== undefined) {
    updates.push('seal_number = ?');
    params.push(seal_number);
  }
  if (remarks !== undefined) {
    updates.push('remarks = ?');
    params.push(remarks);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  params.push(id);

  db.run(`
    UPDATE sampling_records 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `, params, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating sampling record' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sampling record not found' });
    }

    res.json({ message: 'Sampling record updated successfully' });
  });
});

// Delete sampling record
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM sampling_records WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting sampling record' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Sampling record not found' });
    }

    res.json({ message: 'Sampling record deleted successfully' });
  });
});

// Get sample types (predefined)
router.get('/types', authenticateToken, (req, res) => {
  const sampleTypes = [
    '3x250ml delivered Denofa laboratory',
    '4x250ml delivered retained for 6 months',
    '8 part samples to Eurofins for salmonella analysis',
    '1 avg sample to Eurofins for chemical analysis',
    '1 avg sample retained'
  ];

  res.json(sampleTypes);
});

module.exports = router;
