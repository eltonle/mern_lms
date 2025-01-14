const User = require("../../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userName }, { userEmail }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "user name or email already exists",
    });
  }

  // const hashPassword = await bcrypt.hash(password, 10);
  // const newUser = new User({
  //   userName,
  //   userEmail,
  //   role,
  //   password: hashPassword,
  // });

  // await newUser.save();

  // return res.status(201).json({
  //   success: true,
  //   message: "User registered successfully",
  // });
  try {
    // Hacher le mot de passe
    const hashPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // Gérer les erreurs éventuelles
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  console.log(userEmail, password);

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
