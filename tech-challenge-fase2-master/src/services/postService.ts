import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as postModel from '../models/postModel';

export const getAllPosts = () => {
  return postModel.getAllPosts();
};

export const getPostById = async (id: string) => {
  const post = await postModel.getPostById(id);
  if (!post) {
    throw new Error('Post not found');
  }
  return post;
};

export const createPost = (data: {
  title: string;
  content: string;
  author: string;
}) => {
  return postModel.createPost(data);
};

export const updatePost = async (
  id: string,
  data: { title?: string; content?: string; author?: string }
) => {
  try {
    const post = await postModel.updatePost(id, data);
    return post;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error('Post not found');
    }
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    const post = await postModel.deletePost(id);
    return post;
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error('Post not found');
    }
    throw error;
  }
};

export const searchPosts = (term: string) => {
  const normalizedTerm = term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return postModel.searchPosts(normalizedTerm);
};
