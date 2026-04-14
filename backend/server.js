import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import main from './config/db.js';

const app = express();

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (req, res) => res.send('Server is Live!'))

app.use(requireAuth())

app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

main()
.then(() => console.log('Connected to DB'))
.catch(err => console.log((err))
)

export default app;