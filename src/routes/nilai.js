import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import GradesArtifact from '../../artifacts/contracts/PraktikuyGrades.sol/PraktikuyGrades.json' assert { type: "json" };

const router = express.Router();
const prisma = new PrismaClient();

const PROVIDER_URL = process.env.PROVIDER_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const GRADES_CONTRACT_ADDRESS = process.env.GRADES_CONTRACT_ADDRESS;

router.post('/', async (req, res) => {
  try {
    const { pengumpulanId, dosenId, score, komentar } = req.body;
    const pengumpulan = await prisma.pengumpulanTugas.findUnique({
      where: { id: pengumpulanId },
      include: { mahasiswa: true, tugas: true }
    });

    if (!pengumpulan) return res.status(404).json({ error: 'Submission not found' });
    if (!pengumpulan.mahasiswa.walletAddress) return res.status(400).json({ error: 'Student does not have a wallet address' });

    if (!GRADES_CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Grades contract address is not configured' });
    }

    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(GRADES_CONTRACT_ADDRESS, GradesArtifact.abi, wallet);

    const onChainScore = Math.round(score * 100);

    const tx = await contract.recordGrade(
      pengumpulanId, 
      pengumpulan.mahasiswa.walletAddress, 
      onChainScore, 
      pengumpulan.tugas.kelasId
    );
    const receipt = await tx.wait();

    // 3. Save grade to Database
    const nilai = await prisma.nilai.create({
      data: {
        pengumpulanId,
        dosenId,
        nilai: score,
        komentar,
        txHash: receipt.hash
      }
    });

    res.json({ message: 'Grade saved successfully both off-chain and on-chain', nilai, txHash: receipt.hash });
  } catch (error) {
    console.error("Grade Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
