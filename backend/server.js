const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables FIRST — required before anything else reads process.env
dotenv.config();

// Fix network issue where Windows DNS blocks MongoDB SRV lookups natively
// Must run AFTER dotenv so NODE_ENV is available
if (process.env.NODE_ENV !== 'production') {
  require('dns').setServers(['8.8.8.8', '8.8.4.4']);
}

// Connect to MongoDB
connectDB();

const app = express();

// ── CORS Configuration ──────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:3000',   // CRA / alternate
  process.env.FRONTEND_URL,  // Production frontend URL (set in .env)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true); // Open for local dev — tighten in production
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Route Files ──────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const certifiedRoutes = require('./routes/certifiedRoutes');
const internshipRoutes = require('./routes/internshipRoutes');

// ── Mount Routers ─────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/certified', certifiedRoutes);
app.use('/api/v1/internships', internshipRoutes);

// ── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health Check / Root Route ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Online Placement Portal API is running...', status: 'ok' });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// ── Custom Error Middleware ────────────────────────────────────────────────────
app.use(errorHandler);

// ── Crash Protection ──────────────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  // Don't exit in dev — log and continue
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
