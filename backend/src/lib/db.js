import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const {MONGO_URI} = process.env;

    console.log(MONGO_URI);
    if(!MONGO_URI) throw new Error('MongoDB URI is not set');

    const conn = await mongoose.connect(MONGO_URI)

    console.log('MongoDB Connected: ', conn.connection.host);
  } catch (error) {
    console.error("Error connecting to DB: ", error);
    process.exit(1);
  }
}