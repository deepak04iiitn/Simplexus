import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import campaignRoutes from './routes/campaign.route.js';
import briefRoutes from './routes/brief.route.js';
import deliverableRoutes from './routes/deliverable.route.js';
import reviewRoutes from './routes/review.route.js';
import paymentRoutes from './routes/payment.route.js';
import reportRoutes from './routes/report.route.js';
import creatorProfileRoutes from './routes/creatorProfile.route.js';
import ratingRoutes from './routes/rating.route.js';
import collaborationRoutes from './routes/collaboration.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.log(err);
    })

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/backend/auth', authRoutes);
app.use('/backend/user', userRoutes);
app.use('/backend/campaigns', campaignRoutes);
app.use('/backend/briefs', briefRoutes);
app.use('/backend/deliverables', deliverableRoutes);
app.use('/backend/reviews', reviewRoutes);
app.use('/backend/payments', paymentRoutes);
app.use('/backend/reports', reportRoutes);
app.use('/backend/creator-profiles', creatorProfileRoutes);
app.use('/backend/ratings', ratingRoutes);
app.use('/backend/collaboration', collaborationRoutes);

app.get('/backend/ping', (req, res) => {
  res.status(200).send('pong');
});

// Serve frontend files
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// Catch-all route to serve the SPA for any unmatched routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
