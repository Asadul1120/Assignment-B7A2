import { pool } from "../../config/db.js";

const createIssuesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL
      CHECK (char_length(description) >= 20),

      type VARCHAR(30) NOT NULL
      CHECK (type IN ('bug', 'feature_request')),
      
      status VARCHAR(30) DEFAULT 'open' NOT NULL
      CHECK (status IN ('open', 'in_progress', 'resolved')),
      
      reporter_id INT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export default createIssuesTable;
