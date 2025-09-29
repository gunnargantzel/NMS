const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all ships for an order
router.get('/order/:orderId', authenticateToken, (req, res) => {
  const orderId = req.params.orderId;
  
  db.all(
    'SELECT * FROM ships WHERE order_id = ? ORDER BY created_at',
    [orderId],
    (err, ships) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(ships);
    }
  );
});

// Get a specific ship
router.get('/:id', authenticateToken, (req, res) => {
  const shipId = req.params.id;
  
  db.get(
    'SELECT * FROM ships WHERE id = ?',
    [shipId],
    (err, ship) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!ship) {
        return res.status(404).json({ message: 'Ship not found' });
      }
      res.json(ship);
    }
  );
});

// Create a new ship
router.post('/', authenticateToken, (req, res) => {
  const { order_id, vessel_name, vessel_imo, vessel_flag, expected_arrival, expected_departure, remarks } = req.body;
  
  if (!order_id || !vessel_name) {
    return res.status(400).json({ message: 'Order ID and vessel name are required' });
  }
  
  db.run(
    'INSERT INTO ships (order_id, vessel_name, vessel_imo, vessel_flag, expected_arrival, expected_departure, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [order_id, vessel_name, vessel_imo, vessel_flag, expected_arrival, expected_departure, remarks],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating ship' });
      }
      res.status(201).json({
        id: this.lastID,
        order_id,
        vessel_name,
        vessel_imo,
        vessel_flag,
        expected_arrival,
        expected_departure,
        status: 'pending',
        remarks,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Update a ship
router.put('/:id', authenticateToken, (req, res) => {
  const shipId = req.params.id;
  const { vessel_name, vessel_imo, vessel_flag, expected_arrival, expected_departure, status, remarks } = req.body;
  
  const updates = [];
  const values = [];
  
  if (vessel_name !== undefined) {
    updates.push('vessel_name = ?');
    values.push(vessel_name);
  }
  if (vessel_imo !== undefined) {
    updates.push('vessel_imo = ?');
    values.push(vessel_imo);
  }
  if (vessel_flag !== undefined) {
    updates.push('vessel_flag = ?');
    values.push(vessel_flag);
  }
  if (expected_arrival !== undefined) {
    updates.push('expected_arrival = ?');
    values.push(expected_arrival);
  }
  if (expected_departure !== undefined) {
    updates.push('expected_departure = ?');
    values.push(expected_departure);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }
  if (remarks !== undefined) {
    updates.push('remarks = ?');
    values.push(remarks);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }
  
  updates.push('updated_at = ?');
  values.push(new Date().toISOString());
  values.push(shipId);
  
  db.run(
    `UPDATE ships SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating ship' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Ship not found' });
      }
      res.json({ message: 'Ship updated successfully' });
    }
  );
});

// Delete a ship
router.delete('/:id', authenticateToken, (req, res) => {
  const shipId = req.params.id;
  
  db.run(
    'DELETE FROM ships WHERE id = ?',
    [shipId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting ship' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Ship not found' });
      }
      res.json({ message: 'Ship deleted successfully' });
    }
  );
});

module.exports = router;
