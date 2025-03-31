import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/IUser';
import { logError } from '../utilities/logger';
import { ResultSetHeader } from 'mysql2';

// Helper functions
const generateTokens = (userId: number, username: string) => {
  const payload = { userId, username };

  return {
    accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '15m',
    }),
    refreshToken: jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string, // Different secret for refresh tokens
      { expiresIn: '7d' }
    ),
  };
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
      return;
    }

    const [rows] = await db.query<IUser[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = rows?.[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.id === null) {
      throw new Error('User ID is null');
    }
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.username
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh-token',
    });

    res.json({
      user: { id: user.id, username: user.username },
      token: accessToken,
      expiresIn: 15 * 60,
    });
    return;
  } catch (error) {
    logError('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
    return;
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: number; username: string };

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.username
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh-token',
    });

    res.json({
      token: accessToken,
      expiresIn: 15 * 60,
    });
    return;
  } catch (error) {
    logError('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const [existingUsers] = await db.query<IUser[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers?.length) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      message: 'User registered successfully',
    });
  } catch (error) {
    logError('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('refreshToken', {
    path: '/auth/refresh-token',
  });
  res.json({ message: 'Logged out successfully' });
};
