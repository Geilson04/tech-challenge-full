import { Request, Response } from 'express';
import * as postController from './postController';
import * as postService from '../services/postService';

jest.mock('../services/postService');

describe('postController', () => {
  const mockPosts = [
    {
      id: 'PJw207NixHaNZI8F',
      slug: 'fundamentos-de-termodinamica',
      title: 'Fundamentos de Termodinâmica',
      content: 'Reflexões sobre a Potência Motriz do Fogo',
      author: 'Sadi Carnot',
      publishedAt: '2024-10-15T15:12:21.742Z',
      createdAt: '2024-10-15T15:12:21.743Z',
      updatedAt: '2024-10-15T15:12:21.743Z',
    },
    {
      id: 'BZE_2MAMtbEUPCza',
      slug: 'conceitos-de-macroeconomia',
      title: 'Conceitos de Macroeconomia',
      content: 'Uma introdução ao pensamento Keynesiano',
      author: 'John Maynard Keynes',
      publishedAt: null,
      createdAt: '2024-10-15T16:41:09.335Z',
      updatedAt: '2024-10-15T16:41:09.335Z',
    },
  ];

  describe('getPosts', () => {
    it('Should fetch all posts and return them as JSON', async () => {
      const req = {} as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      (postService.getAllPosts as jest.Mock).mockResolvedValue(mockPosts);

      await postController.getPosts(req, res);

      expect(postService.getAllPosts).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });
  });

  describe('getPost', () => {
    it('Should fetch a post by id and return it as JSON', async () => {
      const req = {
        params: { id: 'any_id' },
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      const mockPost = mockPosts[0];
      (postService.getPostById as jest.Mock).mockResolvedValue(mockPost);

      await postController.getPost(req, res);

      expect(postService.getPostById).toHaveBeenCalledWith('any_id');
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('Should return 404 if post is not found', async () => {
      const req = {
        params: { id: 'any_id' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Post not found');
      (postService.getPostById as jest.Mock).mockRejectedValue(error);

      await postController.getPost(req, res);

      expect(postService.getPostById).toHaveBeenCalledWith('any_id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('Should return 500 for other errors', async () => {
      const req = {
        params: { id: 'any_id' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Internal server error');
      (postService.getPostById as jest.Mock).mockRejectedValue(error);

      await postController.getPost(req, res);

      expect(postService.getPostById).toHaveBeenCalledWith('any_id');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });
    });
  });

  describe('createPost', () => {
    it('Should create a new post and return it with status 201', async () => {
      const req = {
        body: {
          title: 'any_title',
          content: 'any_content',
          author: 'any_author',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const newPost = {
        id: 'any_id',
        slug: 'any_slug',
        title: 'any_title',
        content: 'any_content',
        author: 'any_author',
        publishedAt: null,
        createdAt: 'any_date',
        updatedAt: 'any_date',
      };

      (postService.createPost as jest.Mock).mockResolvedValue(newPost);

      await postController.createPost(req, res);

      expect(postService.createPost).toHaveBeenCalledWith({
        title: 'any_title',
        content: 'any_content',
        author: 'any_author',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newPost);
    });

    it('Should return 400 if title or author are missing', async () => {
      const req = {
        body: { content: 'any_content' },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await postController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Title and author are required',
      });
      expect(postService.createPost).not.toHaveBeenCalled();
    });

    it('Should return 500 if there was an error creating the post', async () => {
      const req = {
        body: {
          title: 'any_title',
          content: 'any_content',
          author: 'any_author',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Internal server error');
      (postService.createPost as jest.Mock).mockRejectedValue(error);

      await postController.createPost(req, res);

      expect(postService.createPost).toHaveBeenCalledWith({
        title: 'any_title',
        content: 'any_content',
        author: 'any_author',
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating post' });
    });
  });

  describe('updatePost', () => {
    it('Should update a post and return the updated post', async () => {
      const req = {
        params: { id: 'any_id' },
        body: { title: 'any_new_title' },
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      const updatedPost = {
        ...mockPosts[1],
        title: 'any_new_title',
        updatedAt: 'any_date',
      };

      (postService.updatePost as jest.Mock).mockResolvedValue(updatedPost);

      await postController.updatePost(req, res);

      expect(postService.updatePost).toHaveBeenCalledWith('any_id', {
        title: 'any_new_title',
      });
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    it('Should return 404 if post is not found', async () => {
      const req = {
        params: { id: 'any_id' },
        body: { title: 'any_title' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Post not found');
      (postService.updatePost as jest.Mock).mockRejectedValue(error);

      await postController.updatePost(req, res);

      expect(postService.updatePost).toHaveBeenCalledWith('any_id', {
        title: 'any_title',
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('Should return 500 if there was an error updating the post', async () => {
      const req = {
        params: { id: 'any_id' },
        body: { title: 'any_title' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Internal server error');
      (postService.updatePost as jest.Mock).mockRejectedValue(error);

      await postController.updatePost(req, res);

      expect(postService.updatePost).toHaveBeenCalledWith('any_id', {
        title: 'any_title',
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating post' });
    });
  });

  describe('deletePost', () => {
    it('Should delete a post and return status 204', async () => {
      const req = {
        params: { id: 'any_id' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      (postService.deletePost as jest.Mock).mockResolvedValue(undefined);

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith('any_id');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('Should return 404 if post is not found', async () => {
      const req = {
        params: { id: 'any_id' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Post not found');
      (postService.deletePost as jest.Mock).mockRejectedValue(error);

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith('any_id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });

    it('Should return 500 if there was an error deleting the post', async () => {
      const req = {
        params: { id: 'any_id' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Internal server error');
      (postService.deletePost as jest.Mock).mockRejectedValue(error);

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith('any_id');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting post' });
    });
  });

  describe('searchPosts', () => {
    it('Should fetch posts and return them as JSON', async () => {
      const req = {
        query: { q: 'any_query' },
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      const searchResults = [mockPosts[0]];

      (postService.searchPosts as jest.Mock).mockResolvedValue(searchResults);

      await postController.searchPosts(req, res);

      expect(postService.searchPosts).toHaveBeenCalledWith('any_query');
      expect(res.json).toHaveBeenCalledWith(searchResults);
    });

    it('Should return 400 if the search parameter is missing', async () => {
      const req = {
        query: {},
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await postController.searchPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Search query is required',
      });
      expect(postService.searchPosts).not.toHaveBeenCalled();
    });

    it('Should return 500 if there is an error fetching the posts', async () => {
      const req = {
        query: { q: 'any_query' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Internal server error');
      (postService.searchPosts as jest.Mock).mockRejectedValue(error);

      await postController.searchPosts(req, res);

      expect(postService.searchPosts).toHaveBeenCalledWith('any_query');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error searching posts',
      });
    });
  });
});
