import { matchedData } from "express-validator";
import { createUser, deleteUser, listUsers, updateUser } from "../services/userService.js";

export const getUsers = async (req, res, next) => {
  try {
    res.json(await listUsers());
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const payload = matchedData(req);
    res.status(201).json(await createUser(payload));
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  try {
    const payload = matchedData(req, { locations: ["body"] });
    res.json(await updateUser(req.params.id, payload));
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (req, res, next) => {
  try {
    res.json(await deleteUser(req.params.id));
  } catch (error) {
    next(error);
  }
};

