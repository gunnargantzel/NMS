const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use in-memory database for demo purposes
const dbPath = process.env.DB_PATH || ':memory:';
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Orders table (Main orders only)
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          client_name TEXT NOT NULL,
          client_email TEXT,
          survey_type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          total_ships INTEGER DEFAULT 1,
          total_ports INTEGER DEFAULT 0,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          remarks TEXT,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Ships table
      db.run(`
        CREATE TABLE IF NOT EXISTS ships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          vessel_name TEXT NOT NULL,
          vessel_imo TEXT,
          vessel_flag TEXT,
          expected_arrival DATETIME,
          expected_departure DATETIME,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          remarks TEXT,
          FOREIGN KEY (order_id) REFERENCES orders (id)
        )
      `);

      // Ship ports table
      db.run(`
        CREATE TABLE IF NOT EXISTS ship_ports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ship_id INTEGER NOT NULL,
          port_id INTEGER,
          port_name TEXT NOT NULL,
          port_sequence INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          actual_arrival DATETIME,
          actual_departure DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          remarks TEXT,
          FOREIGN KEY (ship_id) REFERENCES ships (id),
          FOREIGN KEY (port_id) REFERENCES ports (id)
        )
      `);

      // Order lines table (updated to reference ship_ports)
      db.run(`
        CREATE TABLE IF NOT EXISTS order_lines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ship_port_id INTEGER NOT NULL,
          line_number INTEGER NOT NULL,
          description TEXT NOT NULL,
          quantity DECIMAL(10,2) NOT NULL,
          unit TEXT NOT NULL,
          unit_price DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(12,2) NOT NULL,
          cargo_type TEXT,
          package_type TEXT,
          weight DECIMAL(10,2),
          volume DECIMAL(10,2),
          remarks TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ship_port_id) REFERENCES ship_ports (id)
        )
      `);

      // Survey types table
      db.run(`
        CREATE TABLE IF NOT EXISTS survey_types (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Timelog entries table (updated to reference ship_ports)
      db.run(`
        CREATE TABLE IF NOT EXISTS timelog_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ship_port_id INTEGER NOT NULL,
          start_time DATETIME NOT NULL,
          end_time DATETIME,
          activity TEXT NOT NULL,
          remarks TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by_name TEXT,
          FOREIGN KEY (ship_port_id) REFERENCES ship_ports (id),
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Remarks templates table
      db.run(`
        CREATE TABLE IF NOT EXISTS remarks_templates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          template TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Sampling records table (updated to reference ship_ports)
      db.run(`
        CREATE TABLE IF NOT EXISTS sampling_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ship_port_id INTEGER NOT NULL,
          sample_number TEXT NOT NULL,
          sample_type TEXT NOT NULL,
          quantity TEXT,
          destination TEXT,
          seal_number TEXT,
          laboratory TEXT,
          analysis_type TEXT,
          status TEXT,
          remarks TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_by_name TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ship_port_id) REFERENCES ship_ports (id),
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Remarks table (updated to reference ship_ports)
      db.run(`
        CREATE TABLE IF NOT EXISTS remarks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ship_port_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ship_port_id) REFERENCES ship_ports (id),
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Insert default survey types
      const surveyTypes = [
        'Cargo damage survey',
        'Loading and lashing survey',
        'Pre-shipment survey',
        'Sampling',
        'Cargo supervision',
        'Draft survey',
        'Transfer'
      ];

      const stmt = db.prepare('INSERT OR IGNORE INTO survey_types (name) VALUES (?)');
      surveyTypes.forEach(type => {
        stmt.run(type);
      });
      stmt.finalize();

      // Insert default remarks templates
      const remarksTemplates = [
        { category: 'general', template: 'No remarks' },
        { category: 'cargo', template: 'The goods was in apparent good and sound condition prior to discharging.' },
        { category: 'cargo', template: 'The goods was in apparent good and sound condition during loading.' },
        { category: 'weather', template: 'Weather condition: Dry weather' },
        { category: 'inspection', template: 'Ship\'s tanks visually inspected and found empty after discharge.' },
        { category: 'inspection', template: 'Cargo hold(s) visually inspected and found empty after discharge.' },
        { category: 'quality', template: 'Cargo appeared in good condition.' },
        { category: 'outturn', template: 'Outturn based on ship\'s figure.' },
        { category: 'outturn', template: 'Outturn based on shore tank calculation.' },
        { category: 'outturn', template: 'Outturn equals BL-figure' }
      ];

      const remarksStmt = db.prepare('INSERT OR IGNORE INTO remarks_templates (category, template) VALUES (?, ?)');
      remarksTemplates.forEach(remark => {
        remarksStmt.run(remark.category, remark.template);
      });
      remarksStmt.finalize();

      // Insert default timelog activities
      const timelogActivities = [
        'Vessel berthed, all fast',
        'Commenced discharging',
        'Completed discharging',
        'Commenced loading',
        'Completed loading',
        'Hose connected',
        'Hose disconnected',
        'Vessel departed',
        'Surveyor on board',
        'NOR tendered',
        'Pilot on board',
        'All fast',
        'Load compartment inspection',
        'Empty tank inspection',
        'Ullaging / cargo calculation',
        'Safety meeting',
        'Document handling'
      ];

      // Create timelog_activities table
      db.run(`
        CREATE TABLE IF NOT EXISTS timelog_activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          activity TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const activityStmt = db.prepare('INSERT OR IGNORE INTO timelog_activities (activity) VALUES (?)');
      timelogActivities.forEach(activity => {
        activityStmt.run(activity);
      });
      activityStmt.finalize();

      // Insert demo users
      const demoUsers = [
        { username: 'admin', email: 'admin@cargosurvey.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK' }, // password: admin123
        { username: 'surveyor1', email: 'surveyor1@cargosurvey.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK' }, // password: admin123
        { username: 'surveyor2', email: 'surveyor2@cargosurvey.com', password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK' } // password: admin123
      ];

      const userStmt = db.prepare('INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');
      demoUsers.forEach(user => {
        userStmt.run(user.username, user.email, user.password, user.username === 'admin' ? 'admin' : 'user');
      });
      userStmt.finalize();

      // Insert demo orders (main orders only)
      const demoOrders = [
        {
          order_number: 'ORD-20241201-001',
          client_name: 'Statoil ASA',
          client_email: 'cargo@statoil.com',
          survey_type: 'Cargo damage survey',
          status: 'in_progress',
          total_ships: 1,
          total_ports: 2,
          created_by: 1,
          remarks: 'Multi-port cargo survey for crude oil transport'
        },
        {
          order_number: 'ORD-20241201-002',
          client_name: 'Equinor',
          client_email: 'shipping@equinor.com',
          survey_type: 'Loading and lashing survey',
          status: 'pending',
          total_ships: 1,
          total_ports: 1,
          created_by: 2,
          remarks: 'Single port loading survey'
        },
        {
          order_number: 'ORD-20241130-003',
          client_name: 'Aker BP',
          client_email: 'logistics@akerbp.com',
          survey_type: 'Pre-shipment survey',
          status: 'completed',
          total_ships: 2,
          total_ports: 4,
          created_by: 1,
          remarks: 'Multi-ship, multi-port cargo operation'
        },
        {
          order_number: 'ORD-20241130-004',
          client_name: 'Lundin Energy',
          client_email: 'operations@lundin-energy.com',
          survey_type: 'Sampling',
          status: 'pending',
          total_ships: 1,
          total_ports: 3,
          created_by: 3,
          remarks: 'Sampling operation across multiple ports'
        },
        {
          order_number: 'ORD-20241129-005',
          client_name: 'Vår Energi',
          client_email: 'marine@varenergi.no',
          survey_type: 'Cargo supervision',
          status: 'in_progress',
          total_ships: 1,
          total_ports: 2,
          created_by: 2,
          remarks: 'Cargo supervision for refined products'
        }
      ];

      const orderStmt = db.prepare(`
        INSERT OR IGNORE INTO orders 
        (order_number, client_name, client_email, survey_type, status, total_ships, total_ports, created_by, created_at, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      demoOrders.forEach((order, index) => {
        const daysAgo = Math.floor(Math.random() * 7);
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - daysAgo);
        
        orderStmt.run(
          order.order_number,
          order.client_name,
          order.client_email,
          order.survey_type,
          order.status,
          order.total_ships,
          order.total_ports,
          order.created_by,
          createdDate.toISOString(),
          order.remarks
        );
      });
      orderStmt.finalize();

      // Insert demo ships
      const demoShips = [
        // Order 1: Single ship, multi-port
        { order_id: 1, vessel_name: 'M/T Nordic Star', vessel_imo: 'IMO1234567', vessel_flag: 'Norway', status: 'in_progress' },
        
        // Order 2: Single ship, single port
        { order_id: 2, vessel_name: 'M/T North Sea', vessel_imo: 'IMO2345678', vessel_flag: 'Norway', status: 'pending' },
        
        // Order 3: Multi-ship, multi-port
        { order_id: 3, vessel_name: 'M/T Atlantic Explorer', vessel_imo: 'IMO3456789', vessel_flag: 'Norway', status: 'completed' },
        { order_id: 3, vessel_name: 'M/T Pacific Voyager', vessel_imo: 'IMO4567890', vessel_flag: 'Norway', status: 'completed' },
        
        // Order 4: Single ship, multi-port
        { order_id: 4, vessel_name: 'M/T Baltic Trader', vessel_imo: 'IMO5678901', vessel_flag: 'Norway', status: 'pending' },
        
        // Order 5: Single ship, multi-port
        { order_id: 5, vessel_name: 'M/T Norwegian Spirit', vessel_imo: 'IMO6789012', vessel_flag: 'Norway', status: 'in_progress' }
      ];

      const shipStmt = db.prepare(`
        INSERT OR IGNORE INTO ships 
        (order_id, vessel_name, vessel_imo, vessel_flag, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      demoShips.forEach((ship, index) => {
        const daysAgo = Math.floor(Math.random() * 7);
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - daysAgo);
        
        shipStmt.run(
          ship.order_id,
          ship.vessel_name,
          ship.vessel_imo,
          ship.vessel_flag,
          ship.status,
          createdDate.toISOString()
        );
      });
      shipStmt.finalize();

      // Insert demo ship ports
      const demoShipPorts = [
        // Order 1: Nordic Star - 2 ports
        { ship_id: 1, port_name: 'Bergen', port_sequence: 1, status: 'completed' },
        { ship_id: 1, port_name: 'Stavanger', port_sequence: 2, status: 'in_progress' },
        
        // Order 2: North Sea - 1 port
        { ship_id: 2, port_name: 'Bergen', port_sequence: 1, status: 'pending' },
        
        // Order 3: Atlantic Explorer - 2 ports
        { ship_id: 3, port_name: 'Trondheim', port_sequence: 1, status: 'completed' },
        { ship_id: 3, port_name: 'Oslo', port_sequence: 2, status: 'completed' },
        
        // Order 3: Pacific Voyager - 2 ports
        { ship_id: 4, port_name: 'Kristiansand', port_sequence: 1, status: 'completed' },
        { ship_id: 4, port_name: 'Drammen', port_sequence: 2, status: 'completed' },
        
        // Order 4: Baltic Trader - 3 ports
        { ship_id: 5, port_name: 'Oslo', port_sequence: 1, status: 'pending' },
        { ship_id: 5, port_name: 'Bergen', port_sequence: 2, status: 'pending' },
        { ship_id: 5, port_name: 'Stavanger', port_sequence: 3, status: 'pending' },
        
        // Order 5: Norwegian Spirit - 2 ports
        { ship_id: 6, port_name: 'Kristiansand', port_sequence: 1, status: 'completed' },
        { ship_id: 6, port_name: 'Arendal', port_sequence: 2, status: 'in_progress' }
      ];

      const shipPortStmt = db.prepare(`
        INSERT OR IGNORE INTO ship_ports 
        (ship_id, port_name, port_sequence, status, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      demoShipPorts.forEach((shipPort, index) => {
        const daysAgo = Math.floor(Math.random() * 7);
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - daysAgo);
        
        shipPortStmt.run(
          shipPort.ship_id,
          shipPort.port_name,
          shipPort.port_sequence,
          shipPort.status,
          createdDate.toISOString()
        );
      });
      shipPortStmt.finalize();

      // Insert demo timelog entries (now referencing ship_ports)
      const demoTimelogEntries = [
        // Nordic Star - Bergen port
        { ship_port_id: 1, start_time: "2024-12-01 08:00:00", activity: "Vessel berthed, all fast", remarks: "Vessel arrived on schedule" },
        { ship_port_id: 1, start_time: "2024-12-01 08:30:00", activity: "Surveyor on board", remarks: "Initial inspection commenced" },
        { ship_port_id: 1, start_time: "2024-12-01 10:15:00", activity: "Load compartment inspection", remarks: "All compartments found clean and dry" },
        
        // Nordic Star - Stavanger port
        { ship_port_id: 2, start_time: "2024-12-01 14:00:00", activity: "Vessel berthed, all fast", remarks: "Arrived at discharge port" },
        { ship_port_id: 2, start_time: "2024-12-01 14:30:00", activity: "Commenced discharging", remarks: "Discharge operation started" },
        
        // North Sea - Bergen port
        { ship_port_id: 3, start_time: "2024-12-01 09:00:00", activity: "Vessel berthed, all fast", remarks: "Awaiting cargo readiness" },
        
        // Atlantic Explorer - Trondheim port
        { ship_port_id: 4, start_time: "2024-11-30 14:00:00", activity: "Completed discharging", remarks: "All cargo discharged successfully" },
        { ship_port_id: 4, start_time: "2024-11-30 14:30:00", activity: "Vessel departed", remarks: "Survey completed" },
        
        // Norwegian Spirit - Kristiansand port
        { ship_port_id: 10, start_time: "2024-11-29 12:00:00", activity: "Commenced loading", remarks: "Loading operation started" },
        { ship_port_id: 10, start_time: "2024-11-29 16:00:00", activity: "Safety meeting", remarks: "Safety briefing conducted" }
      ];

      const timelogStmt = db.prepare(`
        INSERT OR IGNORE INTO timelog_entries 
        (ship_port_id, start_time, activity, remarks, created_by)
        VALUES (?, ?, ?, ?, ?)
      `);
      demoTimelogEntries.forEach(entry => {
        timelogStmt.run(entry.ship_port_id, entry.start_time, entry.activity, entry.remarks, Math.floor(Math.random() * 3) + 1);
      });
      timelogStmt.finalize();

      // Insert demo sampling records (now referencing ship_ports)
      const demoSamplingRecords = [
        // Nordic Star - Bergen port
        { ship_port_id: 1, sample_number: "S001", sample_type: "3x250ml delivered Denofa laboratory", quantity: "750ml", destination: "Denofa Laboratory", seal_number: "SEAL-001", laboratory: "Denofa Laboratory", analysis_type: "Chemical analysis", status: "Completed", remarks: "Samples taken from different tanks" },
        { ship_port_id: 1, sample_number: "S002", sample_type: "1 avg sample retained", quantity: "250ml", destination: "NMCS Office", seal_number: "SEAL-002", laboratory: "NMCS Office", analysis_type: "Retention", status: "Stored", remarks: "Retained for 6 months" },
        
        // Nordic Star - Stavanger port
        { ship_port_id: 2, sample_number: "S003", sample_type: "Final discharge samples", quantity: "500ml", destination: "Eurofins Laboratory", seal_number: "SEAL-003", laboratory: "Eurofins Laboratory", analysis_type: "Quality control", status: "Pending", remarks: "Final quality samples" },
        
        // Baltic Trader - Oslo port
        { ship_port_id: 5, sample_number: "S004", sample_type: "8 part samples to Eurofins for salmonella analysis", quantity: "8x250ml", destination: "Eurofins Laboratory", seal_number: "SEAL-004", laboratory: "Eurofins Laboratory", analysis_type: "Salmonella testing", status: "In Progress", remarks: "Salmonella testing required" },
        { ship_port_id: 5, sample_number: "S005", sample_type: "1 avg sample to Eurofins for chemical analysis", quantity: "250ml", destination: "Eurofins Laboratory", seal_number: "SEAL-005", laboratory: "Eurofins Laboratory", analysis_type: "Chemical composition", status: "Pending", remarks: "Chemical composition analysis" }
      ];

      const samplingStmt = db.prepare(`
        INSERT OR IGNORE INTO sampling_records 
        (ship_port_id, sample_number, sample_type, quantity, destination, seal_number, laboratory, analysis_type, status, remarks, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      demoSamplingRecords.forEach(record => {
        samplingStmt.run(
          record.ship_port_id,
          record.sample_number,
          record.sample_type,
          record.quantity,
          record.destination,
          record.seal_number,
          record.laboratory,
          record.analysis_type,
          record.status,
          record.remarks,
          Math.floor(Math.random() * 3) + 1
        );
      });
      samplingStmt.finalize();

      resolve();
    });
  });
};

// Initialize database on startup
initializeDatabase().catch(console.error);

module.exports = db;
