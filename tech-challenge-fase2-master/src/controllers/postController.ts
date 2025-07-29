import { Request, Response } from 'express';
import * as postService from '../services/postService';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  const posts = await postService.getAllPosts();
  res.json(posts);
  return;
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const post = await postService.getPostById(id);
    res.json(post);
  } catch (error: any) {
    if (error.message === 'Post not found') {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
  return;
};

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, content, author } = req.body;

  if (!title || !author) {
    res.status(400).json({ message: 'Title and author are required' });
    return;
  }

  try {
    const newPost = await postService.createPost({ title, content, author });
    res.status(201).json(newPost);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating post' });
  }

  return;
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedPost = await postService.updatePost(id, data);
    res.json(updatedPost);
  } catch (error: any) {
    if (error.message === 'Post not found') {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.status(500).json({ message: 'Error updating post' });
  }

  return;
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await postService.deletePost(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Post not found') {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.status(500).json({ message: 'Error deleting post' });
  }

  return;
};

export const searchPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { q } = req.query;

  if (!q) {
    res.status(400).json({ message: 'Search query is required' });
    return;
  }

  try {
    const posts = await postService.searchPosts(q as string);
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: 'Error searching posts' });
  }

  return;
};
