import { Pool } from "pg";
import config from "../config/index.js";
import createUsersTable from "../modules/auth/createAuthTable.js";
import createIssuesTable from "../modules/issues/createIssuesTable.js";

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = () => {
  createUsersTable();
  createIssuesTable();
  console.log("Database connected and tables initialized");
};

export { pool, initDB };
