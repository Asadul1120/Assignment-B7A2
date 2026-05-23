import { Pool } from "pg";
import config from "../config/index";
import createUsersTable from "../modules/auth/createAuthTable";
import createIssuesTable from "../modules/issues/createIssuesTable";

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = () => {
  createUsersTable();
  createIssuesTable();
  console.log("Database connected and tables initialized");
};

export { pool, initDB };
