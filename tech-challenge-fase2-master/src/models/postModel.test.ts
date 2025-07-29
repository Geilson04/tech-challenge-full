import * as postModel from '../models/postModel';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

jest.mock('@prisma/client', () => {
  const mPrisma = {
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $queryRaw: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

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

describe('postModel', () => {
  const prisma = new PrismaClient();

  describe('getAllPosts', () => {
    it('Should fetch all posts', async () => {
      (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

      const posts = await postModel.getAllPosts();

      expect(prisma.post.findMany).toHaveBeenCalled();
      expect(posts).toEqual(mockPosts);
    });
  });

  describe('getPostById', () => {
    it('Should fetch a post by id', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPosts[0]);

      const post = await postModel.getPostById('any_id');

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 'any_id' },
      });
      expect(post).toEqual(mockPosts[0]);
    });
  });

  describe('createPost', () => {
    it('Should create a new post', async () => {
      (nanoid as jest.Mock).mockReturnValue('generated_id');
      const newPost = {
        id: 'generated_id',
        title: 'Fundamentos de Termodinâmica',
        content: 'Reflexões sobre a Potência Motriz do Fogo',
        author: 'Sadi Carnot',
        slug: 'fundamentos-de-termodinâmica', // Corrigido o acento no slug
      };
      (prisma.post.create as jest.Mock).mockResolvedValue({
        ...newPost,
        createdAt: '2024-10-15T15:12:21.743Z',  // Simulando campos automáticos
        updatedAt: '2024-10-15T15:12:21.743Z',
        publishedAt: '2024-10-15T15:12:21.742Z',
      });

      const post = await postModel.createPost({
        title: 'Fundamentos de Termodinâmica',
        content: 'Reflexões sobre a Potência Motriz do Fogo',
        author: 'Sadi Carnot',
      });

      expect(nanoid).toHaveBeenCalledWith(16);
      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          id: 'generated_id',
          title: 'Fundamentos de Termodinâmica',
          content: 'Reflexões sobre a Potência Motriz do Fogo',
          author: 'Sadi Carnot',
          slug: 'fundamentos-de-termodinâmica',
        },
      });
      
      // Usamos `expect.objectContaining` para ignorar os campos automáticos gerados
      expect(post).toEqual(expect.objectContaining(newPost));
    });
  });

  describe('updatePost', () => {
    it('Should update a post', async () => {
      const updatedPost = {
        ...mockPosts[0],
        title: 'New Title',
      };
      (prisma.post.update as jest.Mock).mockResolvedValue(updatedPost);

      const post = await postModel.updatePost('any_id', { title: 'New Title' });

      expect(prisma.post.update).toHaveBeenCalledWith({
        where: { id: 'any_id' },
        data: { title: 'New Title' },
      });
      expect(post).toEqual(updatedPost);
    });
  });

  describe('deletePost', () => {
    it('Should delete a post', async () => {
      (prisma.post.delete as jest.Mock).mockResolvedValue(undefined);

      await postModel.deletePost('any_id');

      expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 'any_id' } });
    });
  });

  describe('searchPosts', () => {
    it('Should search for posts', async () => {
      const searchResults = [mockPosts[0]];
      (prisma.$queryRaw as jest.Mock).mockResolvedValue(searchResults);

      const posts = await postModel.searchPosts('any_query');

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(posts).toEqual(searchResults);
    });
  });
});
