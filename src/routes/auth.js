import express from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL
});

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_KEY in .env file!');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, walletAddress } = req.body;

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: 'Failed to create user in Supabase' });
    }

    // 2. Save user profile to Prisma database with the same ID
    const user = await prisma.user.create({
      data: {
        id: authData.user.id, // Link Prisma User to Supabase Auth User
        email,
        name,
        role: role || 'MAHASISWA',
        walletAddress,
      },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    // 2. Fetch user profile from Prisma to get role and extra info
    const userProfile = await prisma.user.findUnique({
      where: { email },
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found in database' });
    }

    res.json({
      message: 'Login successful',
      token: authData.session.access_token, // JWT from Supabase
      refresh_token: authData.session.refresh_token,
      role: userProfile.role,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
