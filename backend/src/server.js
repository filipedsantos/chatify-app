import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import authRoute from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.routes.js";
import {connectDB} from "./lib/db.js";

dotenv.config();

const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json());  // req.body

app.use('/api/auth', authRoute);

app.use('/api/messages', messagesRoutes);

// make ready for deployment -> serve frontend
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  })
}

app.listen(PORT, async () => {
  console.log('Server running on port:', PORT);

  connectDB()
})