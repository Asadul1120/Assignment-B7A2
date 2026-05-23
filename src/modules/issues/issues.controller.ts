import type { Request, Response } from "express";
import {
  createIssueService,
  getIssuesService,
  updateIssueService,
  deleteIssueService,
  getSingleIssueService,
} from "./issues.service.js";
import type { QueryParams } from "./issues.interface.js";

const createIssueController = async (req: Request, res: Response) => {
  try {
    const payload = {
      ...req.body,
      reporter_id: req.user?.id,
    };

    const result = await createIssueService(payload);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};


const getIssuesController = async (req: Request, res: Response) => {
  try {
    const result = await getIssuesService(req.query as QueryParams);

    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

const getSingleIssueController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await getSingleIssueService(id);
    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

const updateIssueController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const currentUser = req.user as { id: number; role: string };

    const result = await updateIssueService(id, req.body, currentUser);
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

const deleteIssueController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const result = await deleteIssueService(id);
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export {
  createIssueController,
  getIssuesController,
  updateIssueController,
  deleteIssueController,
  getSingleIssueController,
};
