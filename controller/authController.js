import { sendMail } from "../config/sendMail.js";
import User from "../model/user.js";

// Format  to detect role from userId
const getRoleFromUserId = (userId) => {
  if (userId.startsWith("STU")) return "parent";
  if (userId.startsWith("TCH")) return "teacher";
  if (userId.startsWith("AD")) return "admin";
  return null;
};

//  Registers and Sends Login 
export const adminRegister = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, userId } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !userId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check for duplicate
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User ID already exists." });
    }

    // Detect role from the format 
    const role = getRoleFromUserId(userId);
    if (!role) {
      return res.status(400).json({ message: "Invalid user ID format. Cannot determine role." });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      userId,
      role,
    });

    // Generate and hash temporary password
    const tempPass = await user.generateTempPass();
    await user.save();

    //  login link ACCORDING TO role
    let link;
    if (role === "parent") {
      link = `${req.protocol}://localhost:5173/login/${userId}`;
    } else if (role === "teacher") {
      link = `${req.protocol}://localhost:5173/login/${userId}`;
    } else {
      link = `http://your-frontend.com/admin/dashboard/${userId}`;
    }

    // Send  email for log in credentials
    const subject = "Login Credentials";
    const html = `
      <p>Dear ${firstName},</p>
      <p>Your account has been created. Below are your login credentials:</p>
      <p><strong>Username:</strong> ${userId}</p>
      <p><strong>Temporary Password:</strong> ${tempPass}</p>
      <p><a href="${link}">Click here to log in</a> and please change your password after logging in.</p>
    `;

    // Send email
    await sendMail({
      to: email,
      subject,
      html,
    });

    return res.status(201).json({
      success: true,
      message: `User registered successfully as ${role}. Login credentials sent to email.`,
    });
  } catch (error) {
    next(error);
  }
};



//User Logs in with given username and temp password
export const login = async (req, res, next) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    const error = new Error('Username and Password required');
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      const error = new Error('Username or Password Incorrect');
      error.statusCode = 401;
      return next(error);
    }

    // 🔍 Debug logs
    console.log("User found:", user.userId);
    console.log("Stored hash:", user.tempPassword);
    console.log("Input password:", password);

    const isMatching = await user.isMatch(password);

    if (!isMatching) {
      const error = new Error('Username or Password Incorrect');
      error.statusCode = 401;
      return next(error);
    }

    res.status(200).json({
      message: 'Login successful. Please set a new password.',
      userId: user.userId,
      role: user.role,
      status: user.status
    });

  } catch (error) {
    next(error);
  }
};
