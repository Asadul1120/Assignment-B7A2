import type { Issue, QueryParams } from "./issues.interface.js";
import { pool } from "../../config/db.js";

const validTypes = ["bug", "feature_request"];
const validStatuses = ["open", "in_progress", "resolved"];

const validateIssuePayload = (
  payload: Issue,
  isCreate = false,
  canUpdateStatus = false,
) => {
  const { title, description, type, status } = payload;

  if (isCreate && (!title || !description || !type)) {
    throw new Error("Title, description and type are required");
  }

  if (title !== undefined && (title.length === 0 || title.length > 150)) {
    throw new Error("Title must be between 1 and 150 characters");
  }

  if (description !== undefined && description.length < 20) {
    throw new Error("Description must be at least 20 characters");
  }

  if (type !== undefined && !validTypes.includes(type)) {
    throw new Error("Invalid issue type");
  }

  if (status !== undefined && !canUpdateStatus) {
    throw new Error("Only maintainer can update issue status");
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    throw new Error("Invalid issue status");
  }
};

const validateQuery = (query: QueryParams) => {
  const { sort, type, status } = query;

  if (sort && sort !== "newest" && sort !== "oldest") {
    throw new Error("Invalid sort value");
  }

  if (type && !validTypes.includes(type)) {
    throw new Error("Invalid issue type");
  }

  if (status && !validStatuses.includes(status)) {
    throw new Error("Invalid issue status");
  }
};

const createIssueService = async (payload: Issue) => {
  const { title, description, type, reporter_id } = payload;

  validateIssuePayload(payload, true);

  if (!reporter_id) {
    throw new Error("Reporter id is required");
  }

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

  validateQuery(query);

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

  // where condition
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

  // fetch all reporter
  const issuesWithReporter = await Promise.all(
    result.rows.map(async (issue) => {
      const user = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id],
      );

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: user.rows[0],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    }),
  );

  return issuesWithReporter;
};
const getSingleIssueService = async (id: string) => {
  if (!id) {
    throw new Error("Issue id is required");
  }

  const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const user = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [result.rows[0].reporter_id],
  );

  result.rows[0].reporter = user.rows[0];

  delete result.rows[0].reporter_id;

  //final output
  const issue = result.rows[0];
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: issue.reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
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
    validateIssuePayload(payload);

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
      [
        title ?? issue.title,
        description ?? issue.description,
        type ?? issue.type,
        id,
      ],
    );

    return result.rows[0];
  }

  validateIssuePayload(payload, false, true);

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
    [
      title ?? issue.title,
      description ?? issue.description,
      type ?? issue.type,
      status ?? issue.status,
      id,
    ],
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
  getSingleIssueService,
};
