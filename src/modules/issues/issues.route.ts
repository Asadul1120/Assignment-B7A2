import { Router } from "express";
import {
  createIssueController,
  getIssuesController,
  updateIssueController,
  deleteIssueController,
} from "./issues.controller";
import auth from "../../middleware/auth";
import { ROLE } from "../../types";

const router = Router();

router.post(
  "/",
  auth(ROLE.CONTRIBUTOR, ROLE.MAINTAINER),
  createIssueController,
);
router.get("/", auth(ROLE.CONTRIBUTOR, ROLE.MAINTAINER), getIssuesController);
router.patch("/:id", auth( ROLE.CONTRIBUTOR, ROLE.MAINTAINER), updateIssueController);
router.delete("/:id", auth(ROLE.MAINTAINER), deleteIssueController);

export default router;
