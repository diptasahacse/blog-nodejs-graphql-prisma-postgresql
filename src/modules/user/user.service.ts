import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  getPaginationOptions, 
  createPaginatedResult 
} from '../../utils/helpers';
import type { 
  CreateUserInput, 
  CreateProfileInput, 
  PaginationOptions, 
  PaginatedResult,
  AuthPayload 
} from '../../types';

export class UserService {
  async createUser(data: CreateUserInput) {
    const hashedPassword = await hashPassword(data.password);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return { user, token };
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
        _count: {
          select: {
            blogs: true,
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });
  }

  async getUsers(options: PaginationOptions) {
    const { skip, take, page, limit } = getPaginationOptions(options.page, options.limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
          profile: true,
          _count: {
            select: {
              blogs: true,
              comments: true,
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return createPaginatedResult(users, total, page, limit);
  }

  async createProfile(userId: string, data: CreateProfileInput) {
    return prisma.profile.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateProfile(userId: string, data: Partial<CreateProfileInput>) {
    return prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        userId,
      },
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}