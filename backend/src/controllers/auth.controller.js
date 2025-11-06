import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import {generateToken} from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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

export const login = async (req, res) => {
  const {email, password} = req.body;

  if(!email || !password) return res.status(400).json({message: 'Email and Password are required'});

  try {
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message: 'Invalid credentials'});

    const isPasswordCorrect = await bcrypt.compare(password, (user.password));
    if(!isPasswordCorrect) return res.status(400).json({message: 'Invalid credentials'});

    const token = generateToken(user);

    res.status(200).cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //  Prevent XSS attacks: cross-site scripting
      sameSite: 'strict', //  CSRF attacks
      secure: process.env.NODE_ENV === 'development' ? false : true,
    }).json({message: 'Login successfully', data: user});


  } catch (error) {
    console.log('Error in signup controller: ', error);
    return res.status(500).json({message: 'Internal Server Error'});
  }
}

export const logout = (_, res) => {
  return res.status(200).cookie("jwt", "", { maxAge: 0 }).json({message: 'Logout successfully'});
}

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;

    if(!profilePic) return res.status(400).json({message: 'Profile picture is required'});

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url},
      {new: true}
    );

    res.status(200).json(updatedUser);


  } catch (error) {
    console.error("Error in update profile", error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}