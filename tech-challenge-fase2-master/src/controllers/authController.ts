import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      message: 'Name, email, and password are required',
    });
    return;
  }

  try {
    const newUser = await authService.createUser({ name, email, password });
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const { token, user } = await authService.loginUser(email, password);

    res.json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error: any) {
    console.error('Error during login:', error);

    if (error.message === 'Invalid credentials') {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.status(500).json({ message: 'Error logging in' });
  }
};
