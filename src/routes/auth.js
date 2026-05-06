import express from 'express';
import pkg from '@prisma/client';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
const { PrismaClient } = pkg;
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL
});
const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET){
  console.warn('Fatal: jwt belum di set di .env');
  process.exit(1);
}


// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_KEY in .env file!');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {error: "Terlalu banyak percobaan login coba lagi dalam 15 menit"}
})

// Login User
router.post('/login', loginLimiter, async (req, res) => {
 
  try {
    const { email, password } = req.body;
     
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

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

    if (!authData.session) {
      return res.status(401).json({ error: 'Login failed: no session created' });
    }

    const token = jwt.sign(
      {
        id: userProfile.id,
        email: userProfile.email,
        role: userProfile.role,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
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
