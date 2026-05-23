import { Router } from "express";
import {
  createIssueController,
  getIssuesController,
  updateIssueController,
  deleteIssueController,
  getSingleIssueController,
} from "./issues.controller.js";
import auth from "../../middleware/auth.js";
import { ROLE } from "../../types/index.js";

const router = Router();

router.post(
  "/",
  auth(ROLE.CONTRIBUTOR, ROLE.MAINTAINER),
  createIssueController,
);
router.get("/", getIssuesController);
router.get("/:id", getSingleIssueController);
router.patch("/:id", auth(ROLE.CONTRIBUTOR, ROLE.MAINTAINER), updateIssueController);
router.delete("/:id", auth(ROLE.MAINTAINER), deleteIssueController);

export default router;
