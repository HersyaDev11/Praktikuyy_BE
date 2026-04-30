import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import CertificateArtifact from '../../artifacts/contracts/PraktikuyCertificate.sol/PraktikuyCertificate.json' assert { type: "json" };

const router = express.Router();
const prisma = new PrismaClient();


const PROVIDER_URL = process.env.PROVIDER_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account #0
const CERTIFICATE_CONTRACT_ADDRESS = process.env.CERTIFICATE_CONTRACT_ADDRESS;

router.post('/mint', async (req, res) => {
  try {
    const { mahasiswaId, kelasId, fileUrl } = req.body;

    
    const student = await prisma.user.findUnique({ where: { id: mahasiswaId } });
    if (!student || !student.walletAddress) {
      return res.status(400).json({ error: 'Student not found or missing wallet address' });
    }
    if (!CERTIFICATE_CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Smart contract address is not configured in environment' });
    }

    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CERTIFICATE_CONTRACT_ADDRESS, CertificateArtifact.abi, wallet);
    const tokenURI = fileUrl || `https://praktikuy.app/api/sertifikat/metadata/${mahasiswaId}`;

    const tx = await contract.mintCertificate(student.walletAddress, tokenURI);
    const receipt = await tx.wait(); 

    
    const sertifikat = await prisma.sertifikat.create({
      data: {
        mahasiswaId,
        kelasId,
        fileUrl: tokenURI,
        txHash: receipt.hash,
        tokenId: "1" 
      }
    });

    res.json({ message: 'Certificate minted successfully', sertifikat, txHash: receipt.hash });
  } catch (error) {
    console.error("Mint Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/metadata/:id', (req, res) => {
  res.json({
    name: "Praktikuy Graduation Certificate",
    description: "This NFT proves completion of a class on Praktikuy CMS.",
    image: "https://via.placeholder.com/600x400.png?text=Certificate"
  });
});

export default router;
