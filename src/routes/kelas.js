import express from 'express';
import { authenticate, permit } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();



router.get('/kelas/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  // cek mahasiswa sudah bayar
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


router.put('/kelas/:id', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => { 

 });


router.delete('/kelas/:id', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => { 

 });