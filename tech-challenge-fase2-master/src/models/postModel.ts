import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export const getAllPosts = async () => {
  return prisma.post.findMany();
};

export const getPostById = async (id: string) => {
  return prisma.post.findUnique({ where: { id } });
};

export const createPost = async (data: {
  title: string;
  content: string;
  author: string;
}) => {
  const slug = data.title.toLowerCase().replace(/\s+/g, '-');
  const id = nanoid(16);

  return prisma.post.create({
    data: {
      ...data,
      slug,
      id,
    },
  });
};

export const updatePost = async (
  id: string,
  data: { title?: string; content?: string; author?: string }
) => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id: string) => {
  return prisma.post.delete({ where: { id } });
};

export const searchPosts = async (term: string) => {
  const normalizedTerm = term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const posts = await prisma.$queryRaw`
    SELECT * FROM "posts"
    WHERE unaccent(LOWER("title")) LIKE '%' || unaccent(LOWER(${normalizedTerm})) || '%' 
    OR unaccent(LOWER("content")) LIKE '%' || unaccent(LOWER(${normalizedTerm})) || '%';
  `;

  return posts;
};
