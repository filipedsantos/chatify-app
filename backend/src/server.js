import express from 'express';
import dotenv from 'dotenv';

import authRoute from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoute);

app.use('/api/messages', messagesRoutes);

app.listen(PORT, () => {
  console.log('Server running on port:', PORT);
})