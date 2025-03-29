import { db } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, RequestExtended, Response, NextFunction } from 'express';
import { IUser } from '../models/IUser';
import { logError } from '../utilities/logger';
import { ResultSetHeader } from 'mysql2';

// Token verification middleware
export const verifyToken = (
  req: RequestExtended,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err)
        return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = decoded as { userId: number; username: string };
      next();
    }
  );
};

// Login controller
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

    if (!rows || rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
    };

    const accessToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      tokenPayload,
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '7d' }
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Refresh token controller
export const refreshToken = async (
  req: RequestExtended,
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
      process.env.ACCESS_TOKEN_SECRET as string
    ) as { userId: number; username: string };

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh-token',
    });

    res.json({
      token: newAccessToken,
      expiresIn: 15 * 60,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Registration controller
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const [existingUsers] = await db.query<IUser[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers && existingUsers.length > 0) {
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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Logout controller
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('refreshToken', {
    path: '/auth/refresh-token',
  });
  res.json({ message: 'Logged out successfully' });
};
