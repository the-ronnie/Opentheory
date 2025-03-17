import express from "express";
import { Request, Response } from "express";
import { compare } from 'bcryptjs';
import { db } from '../lib/db/drizzle';
import { users } from '../lib/db/schema'; // Removed unused ActivityType import
import { eq } from 'drizzle-orm'; // Removed unused and, isNull imports
import { setSession, hashPassword, clearSession } from '../lib/auth/session';
import { getUserByEmail } from '../lib/db/queries';
import { isAuthenticated } from '../lib/auth/middleware';
// Removed unused logConsultantActivity import

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: 'member',
      })
      .returning();
    
    // Set session cookie
    await setSession(res, user);
    
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session cookie
    await setSession(res, user);
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Logout user
router.post('/logout', (_req: Request, res: Response) => { // Prefixed req with underscore to indicate it's unused
  clearSession(res);
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Protected routes - require authentication
router.use(isAuthenticated);

// Get current user profile
router.get('/me', (req: Request, res: Response) => {
  try {
    // User is already attached to req by the isAuthenticated middleware
    const user = req.user!;
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/me', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { name } = req.body;
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        name,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))
      .returning();
    
    return res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const isValid = await compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash and update new password
    const passwordHash = await hashPassword(newPassword);
    
    await db
      .update(users)
      .set({ 
        passwordHash,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete account (soft delete)
router.delete('/me', async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    
    await db
      .update(users)
      .set({ 
        deletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));
    
    // Clear session
    clearSession(res);
    
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;