const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Controller function for user registration
const register = async (req, res, next) => {
  try {
    // Extract registration data from request body
    const { name, email, password } = req.body;

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for user login
const login = async (req, res, next) => {
    try {
      // Extract login credentials from request body
      const { email, password } = req.body;
  
      // Find the user with the provided email
      const user = await User.findOne({ email });
  
      // If user not found, return error
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If passwords don't match, return error
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // If passwords match, create session or issue token
      // For example, you might use JSON Web Tokens (JWT) for authentication
  
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      next(error);
    }
  };

// Controller function for user logout
const logout = async (req, res, next) => {
    try {
      // Perform any logout-related actions, such as clearing session data or revoking tokens
      // For example, if using sessions:
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie('sessionID'); // Clear session cookie
        res.status(200).json({ message: 'Logout successful' });
      });
    } catch (error) {
      next(error);
    }
  };
  

/* Controller function for password reset

const resetPassword = async (req, res, next) => {}; 

  Won't be used in this project

*/ 

module.exports = {
  register,
  login,
  logout,
  resetPassword
};