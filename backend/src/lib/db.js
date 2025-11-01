import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const {MONGODB_URI} = process.env;
    if(!MONGODB_URI) throw new Error('MongoDB URI is not set');

    const conn = await mongoose.connect(MONGODB_URI)

    console.log('MongoDB Connected: ', conn.connection.host);
  } catch (error) {
    console.error("Error connecting to DB: ", error);
    process.exit(1);
  }
}