import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email and password are required' });
    return;
  }

  try {
    const newUser = await userService.createUser({ name, email, password });
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.message === 'Email already in use') {
      res.status(400).json({ message: 'Email already in use' });
    } else {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    res.status(400).json({ message: 'At least one field (name, email, or password) is required to update' });
    return;
  }

  try {
    const updatedUser = await userService.updateUser(id, { name, email, password });
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
};
