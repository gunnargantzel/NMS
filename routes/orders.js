const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all orders
router.get('/', authenticateToken, (req, res) => {
  const { status, survey_type, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT o.*, u.username as created_by_name 
    FROM orders o 
    LEFT JOIN users u ON o.created_by = u.id
  `;
  let params = [];
  let conditions = [];

  if (status) {
    conditions.push('o.status = ?');
    params.push(status);
  }

  if (survey_type) {
    conditions.push('o.survey_type = ?');
    params.push(survey_type);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders o';
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    db.get(countQuery, params.slice(0, -2), (err, countResult) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        orders,
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

// Get single order
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT o.*, u.username as created_by_name 
    FROM orders o 
    LEFT JOIN users u ON o.created_by = u.id 
    WHERE o.id = ?
  `, [id], (err, order) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  });
});

// Create new order
router.post('/', authenticateToken, (req, res) => {
  const { client_name, client_email, vessel_name, port, survey_type } = req.body;

  if (!client_name || !survey_type) {
    return res.status(400).json({ message: 'Client name and survey type are required' });
  }

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  db.run(`
    INSERT INTO orders (order_number, client_name, client_email, vessel_name, port, survey_type, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [orderNumber, client_name, client_email, vessel_name, port, survey_type, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating order' });
    }

    res.status(201).json({
      message: 'Order created successfully',
      orderId: this.lastID,
      orderNumber
    });
  });
});

// Update order
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { client_name, client_email, vessel_name, port, survey_type, status } = req.body;

  const updates = [];
  const params = [];

  if (client_name !== undefined) {
    updates.push('client_name = ?');
    params.push(client_name);
  }
  if (client_email !== undefined) {
    updates.push('client_email = ?');
    params.push(client_email);
  }
  if (vessel_name !== undefined) {
    updates.push('vessel_name = ?');
    params.push(vessel_name);
  }
  if (port !== undefined) {
    updates.push('port = ?');
    params.push(port);
  }
  if (survey_type !== undefined) {
    updates.push('survey_type = ?');
    params.push(survey_type);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  db.run(`
    UPDATE orders 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `, params, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating order' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully' });
  });
});

// Delete order
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting order' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  });
});

module.exports = router;
