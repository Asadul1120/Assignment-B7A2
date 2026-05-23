import type { Issue, QueryParams } from "./issues.interface";
import { pool } from "../../config/db";

const createIssueService = async (payload: Issue) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues
    (title, description, type, status, reporter_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [title, description, type, "open", reporter_id],
  );

  return result.rows[0];
};

const getIssuesService = async (query: QueryParams) => {
  const { sort, type, status } = query;

  let sql = `SELECT * FROM issues`;
  const values: string[] = [];
  const conditions: string[] = [];

  // filtering
  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  // where
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  // sorting
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const result = await pool.query(sql, values);

  return result.rows;
};

const updateIssueService = async (
  id: string,
  payload: Issue,
  currentUser: { id: number; role: string },
) => {
  const { title, description, type, status } = payload;

  const findingIssue = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  if (findingIssue.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = findingIssue.rows[0];

  if (currentUser.role === "contributor") {

    if (issue.reporter_id !== currentUser.id) {
      throw new Error("Unauthorized to update this issue");
    }

    if (issue.status !== "open") {
      throw new Error("You can only update open issues");
    }
    const result = await pool.query(
      `
      UPDATE issues
      SET
        title = $1,
        description = $2,
        type = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [title, description, type, id],
    );

    return result.rows[0];
  }

  // If user is maintainer, they can update any issue and also update status
  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, id],
  );

  return result.rows[0];
};

const deleteIssueService = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );
  if (result.rows.length === 0) {
    throw new Error("Issue not found");
  }
  return result.rows[0];
};

export {
  createIssueService,
  getIssuesService,
  updateIssueService,
  deleteIssueService,
};
