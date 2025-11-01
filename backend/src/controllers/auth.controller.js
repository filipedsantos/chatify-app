import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import {generateToken} from "../lib/utils.js";

export const signup = async (req, res) => {

  const {fullName, email, password} = req.body;

  try {
    if(!fullName || !email || !password){
      return res.status(400).json({message: 'All fields are required'});
    }

    if(password && password.length < 4){
      return res.status(400).json({message: 'Password must be at least 4 characters'});
    }

    const emailRegex = /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/
    if(email && !emailRegex.test(email) ) {
      return res.status(400).json({message: 'Invalid Email format'});
    }

    const user = await User.findOne({email}).exec();
    if(user) res.status(400).json({message: 'Email already exists'});

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    if(newUser){
      const token = generateToken(newUser._id);
      await newUser.save();

      res.status(201).cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //  Prevent XSS attacks: cross-site scripting
        sameSite: 'strict', //  CSRF attacks
        secure: process.env.NODE_ENV === 'development' ? false : true,
      }).json({message: 'User saved successfully', data:newUser});
    } else {
      res.status(400).json({message: 'Invalid User data'});
    }

  } catch (error) {
    console.log('Error in signup controller: ', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}