import { matchedData } from "express-validator";
import {
  assignLead,
  createLead,
  forwardHotLeadToManager,
  getLeadById,
  getLeadStats,
  listLeads,
  markLeadBooked,
  updateLeadStatus,
  uploadLeadsFromCsv
} from "../services/leadService.js";

export const getLeads = async (req, res, next) => {
  try {
    res.json(await listLeads(req.query, req.user));
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req, res, next) => {
  try {
    res.json(await getLeadById(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
};

export const addLead = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    res.status(201).json(await createLead(payload, req.user));
  } catch (error) {
    next(error);
  }
};

export const uploadCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }
    res.status(201).json(await uploadLeadsFromCsv(req.file.buffer, req.user));
  } catch (error) {
    next(error);
  }
};

export const changeLeadStatus = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    res.json(await updateLeadStatus({ id: req.params.id, ...payload }, req.user));
  } catch (error) {
    next(error);
  }
};

export const assignLeadToUser = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    res.json(await assignLead({ leadId: req.params.id, ...payload }, req.user));
  } catch (error) {
    next(error);
  }
};

export const forwardHotLead = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    res.json(await forwardHotLeadToManager({ leadId: req.params.id, ...payload }, req.user));
  } catch (error) {
    next(error);
  }
};

export const bookLead = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    res.json(await markLeadBooked({ leadId: req.params.id, ...payload }, req.user));
  } catch (error) {
    next(error);
  }
};

export const leadStats = async (req, res, next) => {
  try {
    res.json(await getLeadStats(req.user));
  } catch (error) {
    next(error);
  }
};
