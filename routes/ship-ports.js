const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all ship ports for a ship
router.get('/ship/:shipId', authenticateToken, (req, res) => {
  const shipId = req.params.shipId;
  
  db.all(
    'SELECT * FROM ship_ports WHERE ship_id = ? ORDER BY port_sequence',
    [shipId],
    (err, shipPorts) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(shipPorts);
    }
  );
});

// Get a specific ship port
router.get('/:id', authenticateToken, (req, res) => {
  const shipPortId = req.params.id;
  
  db.get(
    'SELECT * FROM ship_ports WHERE id = ?',
    [shipPortId],
    (err, shipPort) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!shipPort) {
        return res.status(404).json({ message: 'Ship port not found' });
      }
      res.json(shipPort);
    }
  );
});

// Create a new ship port
router.post('/', authenticateToken, (req, res) => {
  const { ship_id, port_id, port_name, port_sequence, remarks } = req.body;
  
  if (!ship_id || !port_name || port_sequence === undefined) {
    return res.status(400).json({ message: 'Ship ID, port name, and port sequence are required' });
  }
  
  db.run(
    'INSERT INTO ship_ports (ship_id, port_id, port_name, port_sequence, remarks) VALUES (?, ?, ?, ?, ?)',
    [ship_id, port_id, port_name, port_sequence, remarks],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating ship port' });
      }
      res.status(201).json({
        id: this.lastID,
        ship_id,
        port_id,
        port_name,
        port_sequence,
        status: 'pending',
        remarks,
        created_at: new Date().toISOString()
      });
    }
  );
});

// Update a ship port
router.put('/:id', authenticateToken, (req, res) => {
  const shipPortId = req.params.id;
  const { port_id, port_name, port_sequence, status, actual_arrival, actual_departure, remarks } = req.body;
  
  const updates = [];
  const values = [];
  
  if (port_id !== undefined) {
    updates.push('port_id = ?');
    values.push(port_id);
  }
  if (port_name !== undefined) {
    updates.push('port_name = ?');
    values.push(port_name);
  }
  if (port_sequence !== undefined) {
    updates.push('port_sequence = ?');
    values.push(port_sequence);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }
  if (actual_arrival !== undefined) {
    updates.push('actual_arrival = ?');
    values.push(actual_arrival);
  }
  if (actual_departure !== undefined) {
    updates.push('actual_departure = ?');
    values.push(actual_departure);
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
  values.push(shipPortId);
  
  db.run(
    `UPDATE ship_ports SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating ship port' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Ship port not found' });
      }
      res.json({ message: 'Ship port updated successfully' });
    }
  );
});

// Delete a ship port
router.delete('/:id', authenticateToken, (req, res) => {
  const shipPortId = req.params.id;
  
  db.run(
    'DELETE FROM ship_ports WHERE id = ?',
    [shipPortId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting ship port' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Ship port not found' });
      }
      res.json({ message: 'Ship port deleted successfully' });
    }
  );
});

module.exports = router;
