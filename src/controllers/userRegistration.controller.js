const prisma = require("../config/prisma");

const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../services/token.service");
const userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //1. Check existing user
    const existing = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Account with this email address already exists.",
      });
    }

    //2. hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
// user login

const UserLogin = async (req, res) => {
  try {
    // 1. check user exist
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Account doesn't exist.",
      });
    }

    //2.check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    } else {
      // Generate token here
      const token = generateAccessToken(user);
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = userRegistration;
