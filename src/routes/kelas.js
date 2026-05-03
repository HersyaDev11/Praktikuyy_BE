import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'praktikuy_super_secret_key';


const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token required' });

  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const permit = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

router.get('/kelas:id', authenticate, async (req, res) => {
  const { id } = req.params;

//   cek mahasiswa sudah bayar
  if (req.user.role === 'MAHASISWA') {
    const paid = await prisma.pembayaran.findFirst({
      where: {
        mahasiswaId: req.user.id,
        kelasId: id,
        status: 'SUCCESS',
      },
    });

    if (!paid) {
      return res.status(403).json({ error: 'Payment required to access this class' });
    }
  }

  const kelas = await prisma.kelas.findUnique({
    where: { id },
    include: { jadwal: true, peserta: true },
  });

  if (!kelas) return res.status(404).json({ error: 'Class not found' });
  res.json(kelas);
});

router.post('/kelas', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => {  
    
});


router.put('/kelas:id', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => { 

 });


router.delete('/kelas:id', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => { 

 });