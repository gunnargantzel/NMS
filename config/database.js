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

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          client_name TEXT NOT NULL,
          client_email TEXT,
          vessel_name TEXT,
          port TEXT,
          survey_type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
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

      // Timelog entries table
      db.run(`
        CREATE TABLE IF NOT EXISTS timelog_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          timestamp DATETIME NOT NULL,
          activity TEXT NOT NULL,
          remarks TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id),
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

      // Sampling records table
      db.run(`
        CREATE TABLE IF NOT EXISTS sampling_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          sample_type TEXT NOT NULL,
          quantity TEXT,
          destination TEXT,
          seal_number TEXT,
          remarks TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders (id),
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

      // Insert demo orders
      const demoOrders = [
        {
          order_number: 'ORD-20241201-001',
          client_name: 'Statoil ASA',
          client_email: 'cargo@statoil.com',
          vessel_name: 'M/T Nordic Star',
          port: 'Stavanger',
          survey_type: 'Cargo damage survey',
          status: 'in_progress',
          created_by: 1
        },
        {
          order_number: 'ORD-20241201-002',
          client_name: 'Equinor',
          client_email: 'shipping@equinor.com',
          vessel_name: 'M/T North Sea',
          port: 'Bergen',
          survey_type: 'Loading and lashing survey',
          status: 'pending',
          created_by: 2
        },
        {
          order_number: 'ORD-20241130-003',
          client_name: 'Aker BP',
          client_email: 'logistics@akerbp.com',
          vessel_name: 'M/T Atlantic Explorer',
          port: 'Trondheim',
          survey_type: 'Pre-shipment survey',
          status: 'completed',
          created_by: 1
        },
        {
          order_number: 'ORD-20241130-004',
          client_name: 'Lundin Energy',
          client_email: 'operations@lundin-energy.com',
          vessel_name: 'M/T Baltic Trader',
          port: 'Oslo',
          survey_type: 'Sampling',
          status: 'pending',
          created_by: 3
        },
        {
          order_number: 'ORD-20241129-005',
          client_name: 'Vår Energi',
          client_email: 'marine@varenergi.no',
          vessel_name: 'M/T Norwegian Spirit',
          port: 'Kristiansand',
          survey_type: 'Cargo supervision',
          status: 'in_progress',
          created_by: 2
        }
      ];

      const orderStmt = db.prepare(`
        INSERT OR IGNORE INTO orders 
        (order_number, client_name, client_email, vessel_name, port, survey_type, status, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      demoOrders.forEach((order, index) => {
        const daysAgo = Math.floor(Math.random() * 7);
        const createdDate = new Date();
        createdDate.setDate(createdDate.getDate() - daysAgo);
        
        orderStmt.run(
          order.order_number,
          order.client_name,
          order.client_email,
          order.vessel_name,
          order.port,
          order.survey_type,
          order.status,
          order.created_by,
          createdDate.toISOString()
        );
      });
      orderStmt.finalize();

      // Insert demo timelog entries
      const demoTimelogEntries = [
        { order_id: 1, timestamp: "2024-12-01 08:00:00", activity: "Vessel berthed, all fast", remarks: "Vessel arrived on schedule" },
        { order_id: 1, timestamp: "2024-12-01 08:30:00", activity: "Surveyor on board", remarks: "Initial inspection commenced" },
        { order_id: 1, timestamp: "2024-12-01 10:15:00", activity: "Load compartment inspection", remarks: "All compartments found clean and dry" },
        { order_id: 2, timestamp: "2024-12-01 09:00:00", activity: "Vessel berthed, all fast", remarks: "Awaiting cargo readiness" },
        { order_id: 3, timestamp: "2024-11-30 14:00:00", activity: "Completed discharging", remarks: "All cargo discharged successfully" },
        { order_id: 3, timestamp: "2024-11-30 14:30:00", activity: "Vessel departed", remarks: "Survey completed" },
        { order_id: 5, timestamp: "2024-11-29 12:00:00", activity: "Commenced loading", remarks: "Loading operation started" },
        { order_id: 5, timestamp: "2024-11-29 16:00:00", activity: "Safety meeting", remarks: "Safety briefing conducted" }
      ];

      const timelogStmt = db.prepare(`
        INSERT OR IGNORE INTO timelog_entries 
        (order_id, timestamp, activity, remarks, created_by)
        VALUES (?, ?, ?, ?, ?)
      `);
      demoTimelogEntries.forEach(entry => {
        timelogStmt.run(entry.order_id, entry.timestamp, entry.activity, entry.remarks, Math.floor(Math.random() * 3) + 1);
      });
      timelogStmt.finalize();

      // Insert demo sampling records
      const demoSamplingRecords = [
        { order_id: 1, sample_type: "3x250ml delivered Denofa laboratory", quantity: "750ml", destination: "Denofa Laboratory", seal_number: "SEAL-001", remarks: "Samples taken from different tanks" },
        { order_id: 1, sample_type: "1 avg sample retained", quantity: "250ml", destination: "NMCS Office", seal_number: "SEAL-002", remarks: "Retained for 6 months" },
        { order_id: 4, sample_type: "8 part samples to Eurofins for salmonella analysis", quantity: "8x250ml", destination: "Eurofins Laboratory", seal_number: "SEAL-003", remarks: "Salmonella testing required" },
        { order_id: 4, sample_type: "1 avg sample to Eurofins for chemical analysis", quantity: "250ml", destination: "Eurofins Laboratory", seal_number: "SEAL-004", remarks: "Chemical composition analysis" }
      ];

      const samplingStmt = db.prepare(`
        INSERT OR IGNORE INTO sampling_records 
        (order_id, sample_type, quantity, destination, seal_number, remarks, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      demoSamplingRecords.forEach(record => {
        samplingStmt.run(
          record.order_id,
          record.sample_type,
          record.quantity,
          record.destination,
          record.seal_number,
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
