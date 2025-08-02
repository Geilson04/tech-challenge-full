import * as postService from '../services/postService';
import * as postModel from '../models/postModel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('../models/postModel');

describe('postService', () => {
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
  ];

  describe('getAllPosts', () => {
    it('Should fetch all posts', async () => {
      (postModel.getAllPosts as jest.Mock).mockResolvedValue(mockPosts);

      const posts = await postService.getAllPosts();

      expect(postModel.getAllPosts).toHaveBeenCalled();
      expect(posts).toEqual(mockPosts);
    });
  });

  describe('getPostById', () => {
    it('Should fetch a post by id', async () => {
      const mockPost = mockPosts[0];
      (postModel.getPostById as jest.Mock).mockResolvedValue(mockPost);

      const post = await postService.getPostById('any_id');

      expect(postModel.getPostById).toHaveBeenCalledWith('any_id');
      expect(post).toEqual(mockPost);
    });

    it('Should throw an error if post is not found', async () => {
      (postModel.getPostById as jest.Mock).mockResolvedValue(null);

      await expect(postService.getPostById('any_id')).rejects.toThrow(
        'Post not found'
      );
    });
  });

  describe('createPost', () => {
    it('Should create a new post', async () => {
      const newPost = {
        id: 'any_id',
        title: 'any_title',
        content: 'any_content',
        author: 'any_author',
        slug: 'any_title',
      };

      (postModel.createPost as jest.Mock).mockResolvedValue(newPost);

      const post = await postService.createPost({
        title: 'any_title',
        content: 'any_content',
        author: 'any_author',
      });

      expect(postModel.createPost).toHaveBeenCalledWith({
        title: 'any_title',
        content: 'any_content',
        author: 'any_author',
      });
      expect(post).toEqual(newPost);
    });
  });

  describe('updatePost', () => {
    it('Should update a post', async () => {
      const updatedPost = {
        id: 'any_id',
        title: 'any_new_title',
        content: 'any_content',
        author: 'any_author',
      };

      (postModel.updatePost as jest.Mock).mockResolvedValue(updatedPost);

      const post = await postService.updatePost('any_id', {
        title: 'any_new_title',
      });

      expect(postModel.updatePost).toHaveBeenCalledWith('any_id', {
        title: 'any_new_title',
      });
      expect(post).toEqual(updatedPost);
    });

    it('Should throw an error if post is not found', async () => {
      const error = new PrismaClientKnownRequestError(
        'Post not found', // mensagem de erro
        {
          code: 'P2025',
          clientVersion: 'any_version',
          meta: undefined,
        }
      );

      (postModel.updatePost as jest.Mock).mockRejectedValue(error);

      await expect(
        postService.updatePost('any_id', { title: 'any_title' })
      ).rejects.toThrow('Post not found');
    });
  });

  describe('deletePost', () => {
    it('Should delete a post', async () => {
      (postModel.deletePost as jest.Mock).mockResolvedValue(undefined);

      await postService.deletePost('any_id');

      expect(postModel.deletePost).toHaveBeenCalledWith('any_id');
    });

    it('Should throw an error if post is not found', async () => {
      const error = new PrismaClientKnownRequestError(
        'Post not found', // mensagem de erro
        {
          code: 'P2025',
          clientVersion: 'any_version',
          meta: undefined,
        }
      );

      (postModel.deletePost as jest.Mock).mockRejectedValue(error);

      await expect(postService.deletePost('any_id')).rejects.toThrow(
        'Post not found'
      );
    });
  });

  describe('searchPosts', () => {
    it('Should search for posts by term', async () => {
      const searchResults = [mockPosts[0]];
      (postModel.searchPosts as jest.Mock).mockResolvedValue(searchResults);

      const posts = await postService.searchPosts('any_query');

      expect(postModel.searchPosts).toHaveBeenCalledWith('any_query');
      expect(posts).toEqual(searchResults);
    });
  });
});
