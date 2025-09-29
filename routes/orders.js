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

// Get single order with ships and ship ports
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Get order details
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

    // Get ships for this order
    db.all(`
      SELECT s.*, 
             GROUP_CONCAT(sp.id) as ship_port_ids,
             GROUP_CONCAT(sp.port_name) as port_names,
             GROUP_CONCAT(sp.port_sequence) as port_sequences
      FROM ships s
      LEFT JOIN ship_ports sp ON s.id = sp.ship_id
      WHERE s.order_id = ?
      GROUP BY s.id
      ORDER BY s.created_at
    `, [id], (err, ships) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      // Get detailed ship ports for each ship
      const getShipPorts = (shipId) => {
        return new Promise((resolve, reject) => {
          db.all(`
            SELECT sp.*, 
                   COUNT(ol.id) as order_lines_count,
                   COUNT(te.id) as timelog_count,
                   COUNT(sr.id) as sampling_count
            FROM ship_ports sp
            LEFT JOIN order_lines ol ON sp.id = ol.ship_port_id
            LEFT JOIN timelog_entries te ON sp.id = te.ship_port_id
            LEFT JOIN sampling_records sr ON sp.id = sr.ship_port_id
            WHERE sp.ship_id = ?
            GROUP BY sp.id
            ORDER BY sp.port_sequence
          `, [shipId], (err, shipPorts) => {
            if (err) reject(err);
            else resolve(shipPorts);
          });
        });
      };

      // Get all ship ports for all ships
      Promise.all(ships.map(ship => getShipPorts(ship.id)))
        .then(shipPortsArrays => {
          // Attach ship ports to ships
          ships.forEach((ship, index) => {
            ship.ship_ports = shipPortsArrays[index];
          });

          order.ships = ships;
          res.json(order);
        })
        .catch(err => {
          res.status(500).json({ message: 'Database error' });
        });
    });
  });
});

// Create new order
router.post('/', authenticateToken, (req, res) => {
  const { client_name, client_email, survey_type, ships, remarks } = req.body;

  if (!client_name || !survey_type) {
    return res.status(400).json({ message: 'Client name and survey type are required' });
  }

  if (!ships || !Array.isArray(ships) || ships.length === 0) {
    return res.status(400).json({ message: 'At least one ship is required' });
  }

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  // Calculate total ships and ports
  const totalShips = ships.length;
  const totalPorts = ships.reduce((sum, ship) => sum + (ship.ports ? ship.ports.length : 0), 0);

  db.run(`
    INSERT INTO orders (order_number, client_name, client_email, survey_type, total_ships, total_ports, created_by, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [orderNumber, client_name, client_email, survey_type, totalShips, totalPorts, req.user.userId, remarks], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating order' });
    }

    const orderId = this.lastID;

    // Create ships and ship ports
    const createShips = () => {
      return new Promise((resolve, reject) => {
        let completed = 0;
        let hasError = false;

        ships.forEach((ship, shipIndex) => {
          // Create ship
          db.run(`
            INSERT INTO ships (order_id, vessel_name, vessel_imo, vessel_flag, expected_arrival, expected_departure, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [orderId, ship.vessel_name, ship.vessel_imo, ship.vessel_flag, ship.expected_arrival, ship.expected_departure, ship.remarks], function(err) {
            if (err && !hasError) {
              hasError = true;
              reject(err);
              return;
            }

            const shipId = this.lastID;

            // Create ship ports
            if (ship.ports && ship.ports.length > 0) {
              ship.ports.forEach((port, portIndex) => {
                db.run(`
                  INSERT INTO ship_ports (ship_id, port_name, port_sequence, remarks)
                  VALUES (?, ?, ?, ?)
                `, [shipId, port.name, portIndex + 1, port.remarks], (err) => {
                  if (err && !hasError) {
                    hasError = true;
                    reject(err);
                    return;
                  }
                });
              });
            }

            completed++;
            if (completed === ships.length && !hasError) {
              resolve();
            }
          });
        });
      });
    };

    createShips()
      .then(() => {
        res.status(201).json({
          message: 'Order created successfully',
          orderId,
          orderNumber
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error creating ships and ports' });
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
