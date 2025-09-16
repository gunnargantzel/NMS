const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');
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

      resolve();
    });
  });
};

// Initialize database on startup
initializeDatabase().catch(console.error);

module.exports = db;
