import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import sertifikatRoutes from './src/routes/sertifikat.js';
import nilaiRoutes from './src/routes/nilai.js';
// TODO: import other routes (kelas, tugas, dll)

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Praktikuy API CMS with Blockchain Integration' });
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/sertifikat', sertifikatRoutes);
app.use('/api/nilai', nilaiRoutes);
app.use('/api/jadwal', jadwalRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
