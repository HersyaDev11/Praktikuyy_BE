import express from 'express';
import { authenticate, permit } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, permit('ADMIN', 'DOSEN', 'MAHASISWA'), async (req, res) => {
  try {
    const jadwal = await prisma.jadwal.findMany({
      include: {
        kelas: true,
        modul: true,
      },
    });
    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, permit('ADMIN', 'DOSEN', 'MAHASISWA'), async (req, res) => {
  try {
    const { id } = req.params;
    const jadwal = await prisma.jadwal.findUnique({
      where: { id },
      include: {
        kelas: true,
        modul: true,
      },
    });

    if (!jadwal) {
      return res.status(404).json({ error: 'Jadwal not found' });
    }

    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => {
  try {
    const { judul, waktuMulai, waktuSelesai, kelasId } = req.body;
  if (!judul || !waktuMulai || !waktuSelesai || !kelasId) {
    return res.status(400).json({ error: 'judul, waktuMulai, waktuSelesai, and kelasId are required' });
  };
    const newJadwal = await prisma.jadwal.create({
      data: {
        judul,
        waktuMulai: new Date(waktuMulai),
        waktuSelesai: new Date(waktuSelesai),
        kelasId,
      },
    });
    res.status(201).json(newJadwal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, waktuMulai, waktuSelesai, kelasId } = req.body;
     if (!judul || !waktuMulai || !waktuSelesai || !kelasId) {
    return res.status(400).json({ error: 'All fields are required for update' });
  };
    const updatedJadwal = await prisma.jadwal.update({
      where: { id },
      data: {
        judul,
        waktuMulai: waktuMulai ? new Date(waktuMulai) : undefined,
        waktuSelesai: waktuSelesai ? new Date(waktuSelesai) : undefined,
        kelasId,
      },
    });
    res.json(updatedJadwal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, permit('ADMIN', 'DOSEN'), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJadwal = await prisma.jadwal.delete({
      where: { id },
    });
    res.json({ message: 'Jadwal deleted', deletedJadwal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
