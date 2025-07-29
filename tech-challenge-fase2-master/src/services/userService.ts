import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as userModel from '../models/userModel';

export const getAllUsers = async () => {
  try {
    return await userModel.getAllUsers();
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export const getUserByEmail = async (email: string) => {
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    return await userModel.createUser(data);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('Email already in use');
    }
    throw error;
  }
};

export const updateUser = async (
  id: string,
  data: { name?: string; email?: string; password?: string }
) => {
  try {
    const user = await userModel.getUserByEmail(data.email || '');
    if (user && user.id !== id) {
      throw new Error('Email already in use');
    }
    
    return await userModel.updateUser(id, data);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('User not found');
    }
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    return await userModel.deleteUser(id);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error('User not found');
    }
    throw error;
  }
};
