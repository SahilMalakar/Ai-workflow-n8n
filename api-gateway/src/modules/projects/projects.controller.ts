import { Request, Response } from "express";
import * as projectService from "./projects.service";
import { sendSuccess, sendError } from "../../core/response";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const data = await projectService.getAllProjects(req.query);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const data = await projectService.getProjectById(req.params.id);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = await projectService.createProject(req.body);
    sendSuccess(res, data, 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const data = await projectService.updateProject(req.params.id, req.body);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (error) {
    sendError(res, error);
  }
};
