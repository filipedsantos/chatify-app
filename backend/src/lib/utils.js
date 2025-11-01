import jwt from 'jsonwebtoken';

export const generateToken = async (userId) => {
  const {JWT_SECRET} = process.env;
  if(!JWT_SECRET) throw new Error('JWT_SECRET is not set');

  return jwt.sign({userId}, JWT_SECRET, {expiresIn: '1h'});
}